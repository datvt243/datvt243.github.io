const exp = (o) => ({ position: 'Dev', company: 'ACME <&>', startDate: Date.UTC(2020, 2, 1), endDate: Date.UTC(2022, 10, 1), isCurrent: false, description: '<p>Did <b>x</b><script>bad()</script></p>', skills: ['Vue', 'TS'], ...o })
const base = {
  firstName: 'Đạt', lastName: 'Võ', email: 'a@b.c', phone: '0123', address: 'HCM', introduction: '<p>Hi</p>', position: 'FE', gender: 'm', birthday: 0, marital: '',
  socialMedia: { github: 'https://github.com/x', linkedin: 'https://linkedin.com/x', website: '' },
  generalInformation: [{ positionDesired: 'Senior FE', professionalSkills: [{ name: 'Vue' }], professionalSkillsGroup: [], foreignLanguages: [{ language: 'English', level: 'B2' }] }],
  experiences: [exp({}), exp({ isCurrent: true, endDate: null, company: 'Now Co' }), exp({ endDate: null, isCurrent: false, company: 'NoEnd' })],
  projects: [{ name: 'P1', position: 'Lead', startDate: Date.UTC(2021, 0, 1), endDate: null, isWorking: true, description: 'd', technology: ['Nuxt'] }, { name: 'P2', position: '', startDate: Date.UTC(2019, 5, 1), endDate: Date.UTC(2019, 8, 1), isWorking: false, description: '', technology: [] }],
  educations: [{ major: 'CS', school: 'Uni', startDate: Date.UTC(2012, 8, 1), endDate: Date.UTC(2016, 5, 1), isCurrent: false, description: 'edu' }],
  certificates: [{ name: 'Cert', organization: 'Org', startDate: Date.UTC(2023, 0, 1), endDate: Date.UTC(2025, 0, 1), isNoExpiration: false, description: 'c' }, { name: 'Cert2', organization: 'Org2', startDate: Date.UTC(2023, 0, 1), endDate: Date.UTC(2025, 0, 1), isNoExpiration: true, description: '' }],
  awards: [{ name: 'Award', organization: 'Org', issueDate: Date.UTC(2024, 3, 1), description: 'aw' }],
  references: [],
}
module.exports = [
  base,
  { ...base, phone: '', address: '', socialMedia: { github: '', linkedin: '', website: 'https://w.x' }, generalInformation: {} },
  { ...base, email: '', socialMedia: {}, experiences: [], projects: [], certificates: [], awards: [] },
]
