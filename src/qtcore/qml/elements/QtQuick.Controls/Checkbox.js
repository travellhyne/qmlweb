registerQmlType({
  module:   'QtQuick.Controls',
  name:     'CheckBox',
  versions: /.*/,
  baseClass: QMLItem,
  constructor: function QMLCheckbox(meta) {
    this.dom = document.createElement("label");
    QMLItem.call(this, meta);
    var self = this;

    var QMLFont = new getConstructor('QtQuick', '2.0', 'Font');
    this.font = new QMLFont(this);

    this.dom.innerHTML = "<input type=\"checkbox\"><span></span>";
    this.dom.style.pointerEvents = "auto";
    this.dom.firstChild.style.verticalAlign = "text-bottom";

    createSimpleProperty("string", this, "text");
    createSimpleProperty("bool", this, "checked");
    createSimpleProperty("color", this, "color");
    createSimpleProperty("int", this, "checkedState");
    createSimpleProperty("bool", this, "partiallyCheckedEnabled");

    this.Component.completed.connect(this, function() {
        this.implicitHeight = this.dom.offsetHeight;
        this.implicitWidth = this.dom.offsetWidth;
    });
    this.textChanged.connect(this, function(newVal) {
        this.dom.children[1].innerHTML = newVal;
        this.implicitHeight = this.dom.offsetHeight;
        this.implicitWidth = this.dom.offsetWidth;
    });
    this.colorChanged.connect(this, function(newVal) {
        this.dom.children[1].style.color = QMLColor(newVal);
    });

    this.checkedChanged.connect(this, function(newVal) {
        this.dom.firstChild.checked = newVal;
    });

    this.checkedStateChanged.connect(this, function(newVal) {
      switch(newVal) {
        case Qt.UnChecked:
          self.checked = false;
          this.dom.firstChild.indeterminate = false;
          break;
        case Qt.Checked:
          self.checked = true;
          this.dom.firstChild.indeterminate = false;
          break;
        case Qt.PartiallyChecked:
          self.checked = false;
          self.partiallyCheckedEnabled = true;
          break;
      }
    });

    this.partiallyCheckedEnabledChanged.connect(this, function(newVal) {
        if (!self.checked) {
          this.dom.firstChild.indeterminate = true;
        } else {
          this.dom.firstChild.indeterminate = false;
        }
    });

    this.dom.firstChild.onchange = function() {
        self.checked = this.checked;
    };
  }
});
