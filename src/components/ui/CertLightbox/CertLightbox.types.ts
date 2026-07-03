export interface CertLightboxItem {
  image: string;
  label: string;
}

export interface CertLightboxProps {
  items: CertLightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}
