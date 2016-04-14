registerQmlType({
  module: 'QtQuick.Controls',
  name: 'Slider',
  versions: /.*/,
  baseClass: QMLItem,
  constructor: function QMLSlider(meta) {
    QMLItem.call(this, meta);

    var self = this;

    this.dom.innerHTML = "<input type=\"range\"/>";
    this.dom.firstChild.style.width = "100%";
    this.dom.firstChild.style.pointerEvents = "auto";

    createSimpleProperty("real", this, "maximumValue");
    createSimpleProperty("real", this, "minimumValue");
    createSimpleProperty("real", this, "stepSize");
    createSimpleProperty("real", this, "value");
    createSimpleProperty("bool", this, "updateValueWhileDragging");
    // TODO: orientation

    this.maximumValueChanged.connect(this, function(newVal) {
      this.dom.firstChild.max = newVal;
    });

    this.minimumValueChanged.connect(this, function(newVal) {
      this.dom.firstChild.min = newVal;
    });

    this.stepSizeChanged.connect(this, function(newVal) {
      this.dom.firstChild.step = newVal;
    });

    this.valueChanged.connect(this, function(newVal) {
      this.dom.firstChild.value = newVal;
    });

    function updateValue(e) {
      if (self.value !== self.dom.firstChild.value) {
        self.value = self.dom.firstChild.value;
      }
    }

    this.updateValueWhileDraggingChanged.connect(this, function(newVal) {
      console.log('Changed');
      if (newVal) {
        console.log('event added');
        self.dom.firstChild.addEventListener('input', updateValue);
      } else {
        console.log('event removed');
        self.dom.firstChild.removeEventListener('input', updateValue);
      }
    });

    this.maximumValue = 1.0;
    this.minimumValue = 0.0;
    this.value = 0;
    this.stepSize = 0;
    this.updateValueWhileDragging = true;

    this.dom.firstChild.onchange = updateValue;
  }
});
