import QtQuick 2.0
import QtQuick.Controls 1.1

ScopeOverrideBase {
  id: foo
  width: 200

  function getFooWidth() { return foo.width }

  Text {
    text: getFooWidth()
  }
}