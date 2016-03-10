registerQmlType({
  module: 'QtQuick',
  name:   'Rectangle',
  versions: /.*/,
  baseClass: QMLItem,
  constructor: function QMLRectangle(meta) {
    QMLItem.call(this, meta);

    createSimpleProperty("color", this, "color");
    createSimpleProperty("real", this, "radius");

    this.border = new QObject(this);
    createSimpleProperty("color", this.border, "color");
    createSimpleProperty("int", this.border, "width");
    this.border.color = 'black'; 
    this.border.width = 1;

    this.colorChanged.connect(this, function(newVal) {
        this.css.backgroundColor = QMLColor(newVal);
    });
    this.radiusChanged.connect(this, function(newVal) {
        this.css.borderRadius = newVal + 'px';
    });
    this.border.colorChanged.connect(this, function(newVal) {
        this.css.borderColor = QMLColor(newVal);

        if (this.css.borderWidth == "0px") {
            this.css.borderWidth = this.border.width+'px';
        }

        this.$updateBorder(this.border.width);
    });
    this.border.widthChanged.connect(this, function(newVal) {
        // ignor negative border width
        if (newVal >= 0) {
            this.$updateBorder(newVal);        
        }else {
            this.css.borderWidth = "0px";
        }
    });

    this.widthChanged.connect(this, function(newVal){
       this.$updateBorder(); 
    });
    this.heightChanged.connect(this, function(newVal){
       this.$updateBorder(); 
    });

    this.color = "white";
    this.radius = 0;
    this.css.borderWidth = '0px';
    this.css.borderStyle = 'solid';
    this.css.borderColor = 'black';

    this.$drawItem = function(c) {
        c.save();
        c.fillStyle = this.color;
        c.strokeStyle = this.border.color;
        c.lineWidth = this.border.width;

        if (!this.radius) {
            c.fillRect(this.left, this.top, this.width, this.height);
            c.strokeRect(this.left, this.top, this.width, this.height);
        } else {
            var r = this.left + this.width;
            var b = this.top + this.height;
            c.beginPath();
            c.moveTo(this.left + this.radius, this.top);
            c.lineTo(r - this.radius, this.top);
            c.quadraticCurveTo(r, this.top, r, this.top + this.radius);
            c.lineTo(r, this.top + this.height - this.radius);
            c.quadraticCurveTo(r, b, r - this.radius, b);
            c.lineTo(this.left + this.radius, b);
            c.quadraticCurveTo(this.left, b, this.left, b - this.radius);
            c.lineTo(this.left, this.top + this.radius);
            c.quadraticCurveTo(this.left, this.top, this.left + this.radius, this.top);
            c.stroke();
            c.fill();
        }
        c.restore();
    };
  }
  
// n
QMLRectangle.prototype.$updateBorder = function(newBorderWidth) {
    // ignor negative border width and update border if was not set
    if (newBorderWidth < 0 || ( typeof newBorderWidth == undefined && this.css.borderWidth == "0px")) {
        return;
    }
    
    // hide border if any of dimensions is less then one
    if (this.width <= 0 || this.height <= 0 || this.width == undefined || this.height == undefined) 
    {
        this.css.borderWidth = '0px';
        return;
    }
                        
    // check if border is not greater than Rectangle size
    if (this.width > 0 && this.height > 0){
        var topBottom = newBorderWidth == undefined ? this.css.borderWidth : newBorderWidth + 'px';
        var leftRight = topBottom;
                
        if (2 * this.border.width > this.height) {
            topBottom = this.height/2 + 'px';
            this.css.height = '0px';
        }else {
            //if (topBottom !== "0px")
            if ( this.height - 2 * this.border.width < this.border.width){
                this.css.height = (this.height%2 ? -1 : -2 + this.height + (this.height - (2*this.border.width))) + 'px';
            }
        }

        if (2 * this.border.width > this.width) {
            leftRight = this.width/2 + 'px';
            this.css.width = '0px';
        }else {
            //if (leftRight !== "0px")
            if (this.width - 2 * this.border.width < this.border.width) {
                this.css.width = (this.width%2 ? -1 : -2 + this.width + ( this.width - (2*this.border.width))) + 'px';
            }
        }
        
        this.css.borderTopWidth = topBottom;
        this.css.borderBottomWidth = topBottom;
        this.css.borderLeftWidth = leftRight;
        this.css.borderRightWidth = leftRight;
    }
};
