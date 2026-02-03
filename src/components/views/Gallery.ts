import { Component } from "../base/Component";

type GalleryData = {
  items: HTMLElement[];
};

export class Gallery extends Component<GalleryData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(value: HTMLElement[]) {
    this.container.replaceChildren(...value);
  }
}
