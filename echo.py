#!/usr/bin/python
# import the libraries
import tornado.web
import tornado.websocket
import tornado.ioloop
import random
import math

players = []
clients = []
# This is our WebSocketHandler - it handles the messages
# from the tornado server
def init_players():
  if len(players)==0:
    choice = "hero"
  if "monster" in players:
    choice = "hero"
  else:
    choice = "monster"
  players.append(choice)
  return choice

e = 19  # always set to 19
p = -1  # change in function
q = -1  # change in function
n = -1  # change in function
z = -1  # change in function
d = 1   # Initialized to 1

def createKeys():
  global e
  global p
  global q
  global n
  global z
  global d

  #p = random.random() * 10000000
  p = int(math.floor(random.random() * 100))
  while(isPrime(p) == False or p % 19 == 0):
    p += 1
  #print "p: " + str(p)

  #q = random.random() * 10000000
  q = int(math.floor(random.random() * 1000))
  while(isPrime(p) == False or p % 19 == 0):
    p += 1
  #print "q: " + str(q)

  n = p * q
  #print "n: " + str(n)

  z = (p-1) * (q-1)
  #print "z: " + str(z)

  while( ((e*d)-1)%z != 1 ):
    d += 1
    #print d
  #print "d: " + str(d)

  print "Finished Creating Server Keys"

def isPrime(num):
  for i in range(2, ((num/2)+1)):
    if(num%i==0):
      return False
  return True

class WebSocketHandler(tornado.websocket.WebSocketHandler):
  global p
  global q
  global n
  global z
  global d

  # the client connected
  def open(self):
    print "New client connected"
    self.write_message("You are connected")
    choice  = init_players()
    self.write_message(choice)
    clients.append(self);

  #This broadcasts the message to all clients
  def on_message(self, message):
    for client in clients:
      print(message)
      client.write_message(message)

  # client disconnected
  def on_close(self):
    clients.remove(self)
    print "Client disconnected"

  def encrypt(message):
    global e
    global n
    return ((toBit(message)^e) % n)

  def decrypt(message):
    global d
    global n
    return ((message^d) % n)

  def toBit(message):
    return ''.join(format(ord(x), 'b') for x in message)

# start a new WebSocket Application
# use "/" as the root, and the 
# WebSocketHandler as our handler
application = tornado.web.Application([
  (r"/", WebSocketHandler),
  ])

# start the tornado server on port 8888
if __name__ == "__main__":
  createKeys()
  application.listen(8988)
  tornado.ioloop.IOLoop.instance().start()