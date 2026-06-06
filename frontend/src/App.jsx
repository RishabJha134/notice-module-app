import { useEffect, useMemo, useState } from 'react';
import { createNotice, deleteNotice, getNotices, updateNotice } from './api/notices';

const roles = ['student', 'teacher', 'principal', 'admin'];

const emptyForm = { title: '', content: '' };

function App() {
  const [role, setRole] = useState('student');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');

  const canCreate = role === 'principal';
  const canEdit = role === 'teacher' || role === 'principal';
  const canDelete = role === 'principal' || role === 'admin';

  const heading = useMemo(() => {
    if (role === 'principal') return 'Principal dashboard';
    if (role === 'teacher') return 'Teacher view';
    if (role === 'admin') return 'Admin view';
    return 'Student view';
  }, [role]);

  const loadNotices = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getNotices();
      setNotices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');

      if (editingId) {
        await updateNotice(editingId, form, role);
      } else {
        await createNotice(form, role);
      }

      setForm(emptyForm);
      setEditingId('');
      await loadNotices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (notice) => {
    setForm({ title: notice.title, content: notice.content });
    setEditingId(notice._id);
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await deleteNotice(id, role);
      await loadNotices();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7_0,_#fff7ed_30%,_#f8fafc_65%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-glow backdrop-blur xl:p-10">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-orange-700">Notice module</p>
              <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">Simple notice board app</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Principal can create notices, teachers can edit them, students can read them, and admin can delete them.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
              <div className="font-semibold text-slate-900">Current role</div>
              <select
                className="mt-2 w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none ring-0"
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  setEditingId('');
                  setForm(emptyForm);
                }}
              >
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">Backend checks the same role through the request header.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-ink">{heading}</h2>
                  <p className="text-sm text-slate-500">{canCreate ? 'You can create notices here.' : 'Read-only access for this role.'}</p>
                </div>
                {editingId ? <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">Editing</span> : null}
              </div>

              {canCreate ? (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-300"
                    placeholder="Notice title"
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                  />
                  <textarea
                    className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-300"
                    placeholder="Notice content"
                    value={form.content}
                    onChange={(event) => setForm({ ...form, content: event.target.value })}
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="w-full sm:w-auto rounded-full bg-slate-900 px-6 py-3 text-base font-bold text-white shadow-lg"
                      type="submit"
                    >
                      {editingId ? 'Update notice' : 'Create notice'}
                    </button>
                    {editingId ? (
                      <button
                        className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                        type="button"
                        onClick={() => {
                          setEditingId('');
                          setForm(emptyForm);
                        }}
                      >
                        Cancel edit
                      </button>
                    ) : null}
                  </div>
                </form>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                  This role cannot create notices.
                </div>
              )}
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-ink">Notices</h2>
                  <p className="text-sm text-slate-500">Live data from MongoDB</p>
                </div>
                <button
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  type="button"
                  onClick={loadNotices}
                >
                  Refresh
                </button>
              </div>

              {error ? <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

              {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Loading notices...</div>
              ) : notices.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">No notices yet.</div>
              ) : (
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <article key={notice._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-ink">{notice.title}</h3>
                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{notice.content}</p>
                        </div>
                        <div className="text-xs text-slate-400">{new Date(notice.createdAt).toLocaleDateString()}</div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {canEdit ? (
                          <button
                            className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-800 transition hover:bg-orange-200"
                            type="button"
                            onClick={() => handleEdit(notice)}
                          >
                            Edit
                          </button>
                        ) : null}

                        {canDelete ? (
                          <button
                            className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                            type="button"
                            onClick={() => handleDelete(notice._id)}
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;