export interface CodeOfConductItem {
  id: string;
  title: string;
  description: string;
}

export interface CodeOfConductData {
  title: string;
  subtitle: string;
  subTitle: string;
  mdMessage: string;
  overviewTitle: string;
  items: CodeOfConductItem[];
}
