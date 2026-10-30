// Results shown next to the logos on the homepage test versions (/home-b, /home-c).
// Only real, sourced numbers go here. When a client shares an after-launch number, add it at the top.
export interface Result { value: string; label: string; source: string; href: string }
export const results: Result[] = [
  { value: '2.5x', label: 'faster campaign discovery for creators', source: 'Promote, as reported by their team', href: '/work/promote-app' },
  { value: '68 / 100', label: 'cancellation reasons traced to design, then redesigned', source: 'FireCut, AI editing plugin', href: '/work/firecut' },
  { value: '4.96', label: 'average rating from clients on Contra', source: 'Contra reviews', href: 'https://contra.com/dominik_meszaros_bpbjfgt0' },
];
