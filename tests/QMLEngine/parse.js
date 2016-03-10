describe('QMLEngine.parse', function() {
  setupDivElement();
  var load = prefixedQmlLoader('QMLEngine/qml/Parse');

  it('should throw error with line number and code extract', function() {
    var exception = null;
    try {
      load('Error', this.div);
    } catch (e) {
      exception = e;
    }
    expect(exception).not.toBe(null);
    expect(exception.message).toContain("properly int error:");
    expect(exception.message).toContain("Unexpected token name");
    expect(exception.message).toContain("line: 4");
    expect(exception.line).toBe(4);
  });
});
