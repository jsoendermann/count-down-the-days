#!/usr/bin/env python3

from datetime import datetime
from requests import get
import fourletterphat as flp
from time import sleep

def flp_print(msg):
  flp.print_str(str(msg))
  flp.show()

while True:
  try:
    today = datetime.today()
    month = today.month
    day = today.day
    hour = today.hour

    if month == 4 and day == 3:
      print("Emma day!")
      flp_print("EMMA")
    elif month == 11 and day == 2:
      print("Jan day!")
      flp_print("JAN")
    elif hour < 8 or hour >= 23:
      print("Before 8 or after 23: {}".format(hour))
      flp.clear()
    else:
      print("Fetching updated countdown...")
      res = get('https://countdown.j51.eu/countdown')
      days = res.text
      flp_print(days)
  except:
    print("Error")
    pass

  sleep(60)
