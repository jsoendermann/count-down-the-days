#!/usr/bin/env python3

from operator import itemgetter
from datetime import datetime
from requests import get
import fourletterphat as flp
from time import sleep

def flp_print(msg):
  flp.print_str(str(msg))
  flp.show()

while True:
  today = datetime.today()
  month = today.month
  day = today.day

  if month == 2 and day == 18:
    flp_print("JAN")
  else:
    res = get('https://countdown.j51.eu/countdown')
    days = res.text
    flp_print(days)

  sleep(60)
