function WordChain(start, target) {
  this.steps = {}

  this.addWord = function(word) {
    var steps = this.steps
    for (var i = 0; i < word.length; i++) {
      var step = word.slice(0, i) + "_" + word.slice(i + 1)
      if (steps[step]) {
        steps[step].push(word)
      } else {
        steps[step] = [word]
      }
    }
  }

  this.loadSteps = function(length) {
    var that = this
    $.get("./dictionary.txt", (dictionary) => {
      var lines = dictionary.split("\n")
      for (var i = 0; i < lines.length; i++) {
        var word = lines[i]
        if (word.length == length) {
          that.addWord(word)
        }
      }
      that.buildWordChain(start, target)
    })
  }

  this.adjacentWords = function(word) {
    var words = new Set
    for (var i = 0; i < word.length; i++) {
      var step = word.slice(0, i) + "_" + word.slice(i + 1)
      this.steps[step].forEach( word => {
        words.add(word)
      })
    }
    words.delete(word)
    return words
  }

  this.buildWordChain = function() {
    var that = this
    var children = new Set([start])
    var parents = {}
    var found = false
    parents[start] = null
    while (children.size > 0) {
      var steps = new Set
      children.forEach( child => {
        that.adjacentWords(child).forEach( nextStep => {
          if (!(nextStep in parents)) {
            parents[nextStep] = child
            if (nextStep == target) {
              found = true
              return that.wordChain(parents, target)
            }
            steps.add(nextStep)
          }
        })
      })
      if (found) {
        return found
      } else {
        children = steps
      }
    }
    $("ul").append($("<li>no chain</li>"))
  }

  this.wordChain = function(parents) {
    $("ul").append($("<li>" + target + "</li>"))
    while (target = parents[target]) {
      $("ul").prepend($("<li>" + target + "</li>"))
    }
  }

  this.loadSteps(start.length)
}

$("form").on("submit", (event => {
  event.preventDefault()
  $("ul").empty()
  var start = $("#start").val()
  var target = $("#target").val()
  new WordChain(start, target)
}))
