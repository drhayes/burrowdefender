# Utility functions.

loki.modules.utils = (env) ->
  # Basic collision routine between two rects.
  env.collide = (rect1, rect2) ->
    return false if rect1.y2 < rect2.y1
    return false if rect1.y1 > rect2.y2
    return false if rect1.x2 < rect2.x1
    return false if rect1.x1 > rect2.x2
    true
  
  # Acts like a list but keeps objects sorted by their 'priority' attribute.
  env.pqueue = () ->
    list = []
    oldpush = list.push
    list.push = (o) ->
      l = oldpush.call(list, o)
      l.sort((a, b) -> a.priority - b.priority)
      l
    list
