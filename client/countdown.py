#!/usr/bin/env python3

import requests
# import fourletterphat as flp

res = requests.get('https://countdown.j51.eu/countdown')
days = r.text

flp.print_str(str(days))
flp.show()
