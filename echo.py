#!/usr/bin/python
# import the libraries
import tornado.web
import tornado.websocket
import tornado.ioloop

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



class WebSocketHandler(tornado.websocket.WebSocketHandler):
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

# start a new WebSocket Application
# use "/" as the root, and the 
# WebSocketHandler as our handler
application = tornado.web.Application([
  (r"/", WebSocketHandler),
  ])

# start the tornado server on port 8888
if __name__ == "__main__":
  application.listen(8888)
  tornado.ioloop.IOLoop.instance().start()


