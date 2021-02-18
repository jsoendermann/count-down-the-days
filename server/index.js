const { existsSync, readFileSync, writeFileSync } = require("fs")
const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const auth = require("koa-basic-auth")
const Router = require("@koa/router")

const { PASSWORD } = process.env
if (!PASSWORD) {
  console.error("PASSWORD missing")
  process.exit(-1)
}
const PORT = 9980

const FILENAME = "./saved-date.txt"
let date

if (existsSync(FILENAME)) {
  const savedDateStr = readFileSync("./saved-date.txt", {
    encoding: "utf-8",
  }).trim()
  date = new Date(savedDateStr)
}

function setDate(newDate) {
  date = new Date(newDate)
  writeFileSync(FILENAME, newDate, { encoding: "utf-8" })
}

const diffDays = (date1, date2) =>
  Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24))

const externalRouter = new Router()
externalRouter.get("/countdown", async (ctx) => {
  if (!date) {
    ctx.throw(500)
  }
  ctx.status = 200
  ctx.body = diffDays(new Date(), date)
})

const internalRouter = new Router()
internalRouter.use(
  auth({
    name: "countdown",
    pass: PASSWORD,
  })
)
internalRouter.get("/set-date", async (ctx) => {
  ctx.status = 200
  ctx.body = `
  <h3>${ctx.request.query.msg ?? ""}</h3>
  <form action="/set-date" method="post">
    <input type="date" name="newDate"><br><br>
    <input type="submit" value="Submit">
  </form>
  `
})
internalRouter.post("/set-date", async (ctx) => {
  const { newDate } = ctx.request.body
  if (!newDate || !/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    ctx.redirect("/set-date?msg=Invalid%20date")
    return
  }

  setDate(newDate)

  ctx.redirect("/set-date?msg=Success")
})

const app = new Koa()

app.use(bodyParser({ jsonLimit: "1mb" }))

app.use(externalRouter.routes()).use(externalRouter.allowedMethods())
app.use(internalRouter.routes()).use(internalRouter.allowedMethods())

console.log(`Listening on ${PORT}...`)
app.listen(PORT)
