registerQmlType({
  module: 'QtQuick.Controls',
  name: 'ProgressBar',
  versions: /.*/,
  baseClass: QMLItem,
  constructor: function QMLProgressBar(meta) {
    QMLItem.call(this, meta);
    var self = this;

    this.dom.innerHTML = "<progress></progress>";
    this.dom.firstChild.style.width = "100%";

    createSimpleProperty("bool", this, "indeterminate");
    createSimpleProperty("real", this, "maximumValue");
    createSimpleProperty("real", this, "minimumValue");
    createSimpleProperty("enum", this, "orientation");
    createSimpleProperty("real", this, "value");

    this.indeterminate = false;
    this.maximumValue = 1;
    this.minimumValue = 0;
    this.orientation = Qt.Horizontal;
    this.value = 0;

    this.indeterminateChanged.connect(this, function(newVal) {
      if (newVal) {
        self.dom.firstChild.removeAttribute("value");
      } else {
        self.dom.firstChild.value = self.value;
      }
    });

    function extremitiesChanged(newVal) {
      // max is the total range the minimum and maximum
      // as per Qt docs, If maximumValue is smaller than minimumValue,
      // minimumValue will be maximumValue
      var maxVal = newVal >= self.minimumValue ?
        newVal - self.minimumValue : self.minimumValue - newVal;
      self.dom.firstChild.max = maxVal;
    }

    this.maximumValueChanged.connect(this, extremitiesChanged);
    this.maximumValueChanged.connect(this, extremitiesChanged);

    this.valueChanged.connect(this, function(newVal) {
      var minVal = self.minimumValue < self.maximumValue ?
        self.minimumValue : self.maximumValue;

      var trueVal = newVal - Math.abs(minVal);
      self.dom.firstChild.value = trueVal;
    });
  }
});
