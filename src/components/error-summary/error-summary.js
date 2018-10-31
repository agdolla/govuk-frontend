import '../../vendor/polyfills/Event' // addEventListener

function ErrorSummary ($module) {
  this.$module = $module
}

ErrorSummary.prototype.init = function () {
  var $module = this.$module
  if (!$module) {
    return
  }
  window.addEventListener('load', function () {
    $module.focus()
  })

  $module.addEventListener('click', this.onClick.bind(this))
}

ErrorSummary.prototype.onClick = function (event) {
  var target = event.target
  if (this.focusTarget(target)) {
    event.preventDefault()
  }
}

// Focus the target element
//
// By default, the browser will scroll the target into view. Because our labels
// or legends appear above the input, this means the user will be presented with
// an input without any context, as the label or legend will be off the top of
// the screen.
//
// Manually handling the click event, focussing the element and scrolling the
// question into view solves this.
ErrorSummary.prototype.focusTarget = function ($target) {
  // If the element that was clicked was not a link, return early
  if ($target.tagName !== 'A' || $target.href === false) {
    return false
  }

  // Find the element
  var inputId = this.getTargetId($target)
  var $input = document.getElementById(inputId)
  if (!$input) {
    return false
  }

  var $legendOrLabel = this.getAssociatedLegendOrLabel($input)
  if (!$legendOrLabel) {
    return false
  }

  // Manually update the hash in the URL, focus the element and scroll the
  // associated legend or label into view
  window.location.hash = inputId
  $input.focus({ preventScroll: true })
  $legendOrLabel.scrollIntoView()

  return true
}

// Extract the ID of the element from the target - everything after (but not
// including) the hash
ErrorSummary.prototype.getTargetId = function($target) {
  var href = $target.getAttribute('href')
  if (href.indexOf('#') === -1) {
    return false
  }

  return href.split('#').pop()
}

// Get associated legend or label
//
// Returns the first element that exists from this list:
// - The legend associated with the closest fieldset ancestor
// - The first label that is associated with the input using for="inputId"
// - The closest parent label
ErrorSummary.prototype.getAssociatedLegendOrLabel = function($input) {
  var $fieldset = $input.closest('fieldset')

  if ($fieldset) {
    var legends = $fieldset.getElementsByTagName('legend')

    if (legends.length) {
      return legends[0]
    }
  }

  return document.querySelector("label[for='" + $input.getAttribute('id') + "']")
    || $input.closest('label')
}

export default ErrorSummary
