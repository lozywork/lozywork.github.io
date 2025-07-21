export interface ProjectItem {
  id: number;
  name: string;
  description: string;
  typ: 'music' | 'film';
  src: string;
  coverSrc: string;
}
