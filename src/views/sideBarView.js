import { View } from './View.js';

class SideBarView extends View {
  showUI() {
    this.sortWrapper.classList.remove(`hidden`);
    this.sortWrapper.style.display = `flex`;
    this.deleteAll.classList.remove(`hidden`);
  }
  hideUI() {
    this.sortWrapper.classList.add(`hidden`);
    this.sortWrapper.style.removeProperty(`display`);
    this.deleteAll.classList.add(`hidden`);
  }
}

export default new SideBarView();
