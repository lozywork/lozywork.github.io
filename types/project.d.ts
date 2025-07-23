export interface ProjectItem {
  id: number;
  date: string;
  name: string;
  description: string;
  typ: 'music' | 'film';
  src: string;
  coverSrc: string;
}
