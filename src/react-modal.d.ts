declare module 'react-modal' {
  import { Component } from 'react';

  interface Props {
    isOpen: boolean;
    onAfterOpen?: () => void;
    onRequestClose?: (event: MouseEvent | KeyboardEvent) => void;
    closeTimeoutMS?: number;
    style?: {
      overlay?: object;
      content?: object;
    };
    contentLabel?: string;
    portalClassName?: string;
    overlayClassName?: string;
    className?: string | object;
    bodyOpenClassName?: string;
    htmlOpenClassName?: string;
    ariaHideApp?: boolean;
    appElement?: HTMLElement;
    testId?: string;
    parentSelector?: () => HTMLElement;
    aria?: {
      [key: string]: string;
    };
    data?: {
      [key: string]: string;
    };
    role?: string;
    shouldFocusAfterRender?: boolean;
    shouldCloseOnOverlayClick?: boolean;
    shouldReturnFocusAfterClose?: boolean;
    preventScroll?: boolean;
    overlayRef?: (node: HTMLElement | null) => void;
    contentRef?: (node: HTMLElement | null) => void;
    id?: string;
    children?: ReactNode;
  }

  export default class Modal extends Component<Props> {}
}
