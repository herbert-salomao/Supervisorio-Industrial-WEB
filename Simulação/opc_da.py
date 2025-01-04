

import OpenOPC

import time

opc = OpenOPC.open_client('localhost')
servers = opc.servers()
print("Available OPC Servers:", servers)