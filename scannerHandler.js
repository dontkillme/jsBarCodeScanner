class ScannerEvent {
  buffor = "";
  reading = false;
  domElem = null;
  shiftKeyCode = 16;
  endingKeyCodes = [9, 13];
  scanTime = 50;
  timeBetweenChars = 12;
  minChars = 5;


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
	let tmpTime = 0;
    if (e.keyCode == this.shiftKeyCode) {
      return;
    }

    if (this.endingKeyCodes.includes(e.keyCode)) {
      this.fireEvent();
    } else if (!e.altKey && !e.ctrlKey) {
      this.buffor += String.fromCharCode(e.keyCode);
	  tmpTime = this.end;
	  this.end = new Date();
    }
	
	if (Math.ceil(tmpTime - this.end) < this.timeBetweenChars) {
		clearInterval(this.readEndTimeout);
		this.reading = false;
	}
	
    if (!this.reading) {
	  this.end = new Date();
      this.reading = true;
      this.readEndTimeout = setTimeout(this.fireEvent, this.scanTime);
    }   
  }

  reset() {
	this.buffor = "";
	this.reading = false;
  }

  fireEvent = () => {
	if (this.buffor.length < this.minChars) {
      this.reset();
	  return;
	}
	
    const scanEvent = new CustomEvent("scanEnd", {
      detail: {
        value: this.buffor
      }
    });
    this.domElem.dispatchEvent(scanEvent);
    this.reset();
  }
}

//Still adding this to main scope
window.ScannerHandler = new ScannerEvent();
