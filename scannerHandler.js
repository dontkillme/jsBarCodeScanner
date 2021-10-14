'use strict'

class ScannerEvent {
  constructor(noDefault = true) {  
    this.buffor = "";
    this.reading = false;
    this.domElem = null;
    this.shiftKeyCode = 16;
    this.endingKeyCodes = [9, 13];
    this.scanTime = 50;
    this.timeBetweenChars = 12;
    this.minChars = 5;
    this.noDefault = noDefault;
    this.scannerRead = function(e) {
      e.stopPropagation();
      
      if (this.noDefault) {
        e.preventDefault();
      }
      
      let tmpTime = 0;
      if (e.keyCode == this.shiftKeyCode) {
        return;
      }

      if (this.endingKeyCodes.includes(e.keyCode)) {
        this.fireEvent();
        clearInterval(this.readEndTimeout);
        return;
      } else if (!e.altKey && !e.ctrlKey) {
        this.buffor += e.key; 
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
        this.readEndTimeout = setTimeout(this.fireEvent.bind(this), this.scanTime);
      }   
    }
      
    this.fireEvent = function(e) {
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

  register(domElem) {
    this.domElem = domElem;
    domElem.addEventListener("keypress", this.scannerRead.bind(this));
  }

  changeScanTime(scanTime) {
    this.scanTime = scanTime
  }

  unregister() {
    this.domElem.removeEventListener("keypress", this.scannerRead.bind(this));
  }

  reset() {
	  this.buffor = "";
	  this.reading = false;
  }
}

module.exports = ScannerEvent;