# jsBarCodeScanner
Small js script adding barcode scanner support for websites;

<b>How does it works</b>

Register DOM element which will react to keydown event.
Best option is to use document.

```javascript
ScannerHandler.register(document);
```

After that add event listener to document element on <b>scanEnd</b> event.

```javascript
document.addEventListener('scanEnd', function(e) {
  document.querySelector("#sth").innerHTML = e.detail.value;
});
```

Value readed by scanner will be in event.detail.value.
