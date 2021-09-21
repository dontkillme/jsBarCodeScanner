class ScannerEvent {
  buffor = "";
  reading = false;
  domElem = null;
  shiftKeyCode = 16;
  endingKeyCodes = [9, 13];
  scanTime = 200;


  register(domElem) {
    this.domElem = domElem;
    domElem.addEventListener("keydown", this.scannerRead);
  }

  changeScanTime(scanTime) {
    this.scanTime = scanTime
  }

  unregister() {
    this.domElem.removeEventListener("keydown", this.scannerRead);
  }

  scannerRead = (e) => {
    if (e.keyCode == this.shiftKeyCode) {
      return;
    }

    if (this.endingKeyCodes.includes(e.keyCode)) {
      this.fireEvent();
    } else {
      this.buffor += e.key;
    }

    if (!this.reading) {
      this.reading = true;
      setTimeout(this.fireEvent, this.scanTime);
    }   
  }

  fireEvent = () => {
    const scanEvent = new CustomEvent("scanEnd", {
      detail: {
        value: this.buffor
      }
    });
    this.domElem.dispatchEvent(scanEvent);
    this.buffor = "";
    this.reading = false;
  }
}

//at this version class is added to window directly
window.ScannerHandler = new ScannerEvent();
