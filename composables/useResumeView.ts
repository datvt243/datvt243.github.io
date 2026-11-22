/**
 * @file Dev (editor) or HR (plain resume) view of the home page, shared by
 * the header switch and `ThemeResumeObject`. Plain state mirrored to `?view=hr`
 * after mount, not a cookie: `/` is ISR-cached, so the server must always
 * render the default Dev view.
 */
export const useResumeView = () => useState<'dev' | 'hr'>('resumeView', () => 'dev')
