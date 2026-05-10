import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../../api/user.api'
import type {User} from '../../types'
import { formatDate } from '../../utils/helpers'
import { useAuthStore } from '../../store/auth.store'
import { toast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

// Role badge
function RoleBadge({ role }: { role: string }) {
    const map: Record<string, { bg: string; color: string }> = {
        OWNER:       { bg: '#fdf4ff', color: '#9333ea' },
        MANAGER:     { bg: '#eff6ff', color: '#2563eb' },
        CASHIER:     { bg: '#f0fdf4', color: '#16a34a' },
        STOREKEEPER: { bg: '#fff7ed', color: '#ea580c' },
    }
    const s = map[role] || { bg: '#f1f5f9', color: '#64748b' }
    return (
        <span style={{ background: s.bg, color: s.color, fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' }}>
      {role}
    </span>
    )
}

//  Avatar
function Avatar({ name, role }: { name: string; role: string }) {
    const colors: Record<string, string> = {
        OWNER:       '#9333ea',
        MANAGER:     '#2563eb',
        CASHIER:     '#16a34a',
        STOREKEEPER: '#ea580c',
    }
    const color = colors[role] || '#64748b'
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    return (
        <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
        }}>
            <span style={{ color, fontSize: '13px', fontWeight: 600 }}>{initials}</span>
        </div>
    )
}

// Input style
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    border: '1px solid #e2e8f0', borderRadius: '8px',
    fontSize: '14px', color: '#0f172a', outline: 'none',
    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
    background: '#fff',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{
                display: 'block', color: '#64748b', fontSize: '12px',
                fontWeight: 500, marginBottom: '6px',
                letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
                {label}
            </label>
            {children}
        </div>
    )
}

//Create user form
interface CreateFormData {
    name:     string
    email:    string
    password: string
    role:     string
}

const emptyCreateForm: CreateFormData = {
    name: '', email: '', password: '', role: 'CASHIER',
}

function CreateUserForm({
                            form, onChange, onSubmit, onClose, loading,
                        }: {
    form:     CreateFormData
    onChange: (f: CreateFormData) => void
    onSubmit: () => void
    onClose:  () => void
    loading:  boolean
}) {
    const set = (key: keyof CreateFormData, val: string) =>
        onChange({ ...form, [key]: val })

    return (
        <>
            <Field label="Full name *">
                <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Jane Wanjiku" autoFocus />
            </Field>
            <Field label="Email *">
                <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@shop.com" />
            </Field>
            <Field label="Password *">
                <input style={inputStyle} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number" />
            </Field>
            <Field label="Role *">
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.role} onChange={e => set('role', e.target.value)}>
                    <option value="CASHIER">Cashier</option>
                    <option value="MANAGER">Manager</option>
                    <option value="STOREKEEPER">Storekeeper</option>
                </select>
            </Field>

            {/* Role descriptions */}
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                {form.role === 'CASHIER'     && '🛒 Can process sales, view products and customers.'}
                {form.role === 'MANAGER'     && '📊 Can manage products, customers, users and view reports.'}
                {form.role === 'STOREKEEPER' && '📦 Can view and update inventory and products.'}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading || !form.name || !form.email || !form.password}
                    style={{
                        padding: '9px 20px', borderRadius: '8px', border: 'none',
                        background: '#2563eb', color: '#fff', fontSize: '14px',
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        opacity: loading || !form.name || !form.email || !form.password ? 0.6 : 1,
                    }}
                >
                    {loading ? 'Creating...' : 'Create user'}
                </button>
            </div>
        </>
    )
}

//  Edit user form
interface EditFormData { name: string; role: string }

function EditUserForm({
                          form, onChange, onSubmit, onClose, loading, isOwner,
                      }: {
    form:     EditFormData
    onChange: (f: EditFormData) => void
    onSubmit: () => void
    onClose:  () => void
    loading:  boolean
    isOwner:  boolean
}) {
    const set = (key: keyof EditFormData, val: string) =>
        onChange({ ...form, [key]: val })

    return (
        <>
            <Field label="Full name *">
                <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
            </Field>
            {!isOwner && (
                <Field label="Role">
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.role} onChange={e => set('role', e.target.value)}>
                        <option value="CASHIER">Cashier</option>
                        <option value="MANAGER">Manager</option>
                        <option value="STOREKEEPER">Storekeeper</option>
                    </select>
                </Field>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading || !form.name}
                    style={{
                        padding: '9px 20px', borderRadius: '8px', border: 'none',
                        background: '#2563eb', color: '#fff', fontSize: '14px',
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        opacity: loading || !form.name ? 0.6 : 1,
                    }}
                >
                    {loading ? 'Saving...' : 'Save changes'}
                </button>
            </div>
        </>
    )
}

//  Reset password form
function ResetPasswordForm({
                               onSubmit, onClose, loading,
                           }: {
    onSubmit: (pwd: string) => void
    onClose:  () => void
    loading:  boolean
}) {
    const [pwd, setPwd] = useState('')

    return (
        <>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 16px', lineHeight: 1.6 }}>
                Set a new temporary password for this user. They should change it after logging in.
            </p>
            <Field label="New password *">
                <input
                    style={inputStyle}
                    type="password"
                    value={pwd}
                    onChange={e => setPwd(e.target.value)}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    autoFocus
                />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                </button>
                <button
                    onClick={() => onSubmit(pwd)}
                    disabled={loading || pwd.length < 8}
                    style={{
                        padding: '9px 20px', borderRadius: '8px', border: 'none',
                        background: '#ea580c', color: '#fff', fontSize: '14px',
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        opacity: loading || pwd.length < 8 ? 0.6 : 1,
                    }}
                >
                    {loading ? 'Resetting...' : 'Reset password'}
                </button>
            </div>
        </>
    )
}

//  Change own password form
function ChangePasswordForm({
                                onSubmit, onClose, loading,
                            }: {
    onSubmit: (current: string, next: string) => void
    onClose:  () => void
    loading:  boolean
}) {
    const [current, setCurrent] = useState('')
    const [next,    setNext]    = useState('')

    return (
        <>
            <Field label="Current password *">
                <input style={inputStyle} type="password" value={current} onChange={e => setCurrent(e.target.value)} autoFocus />
            </Field>
            <Field label="New password *">
                <input style={inputStyle} type="password" value={next} onChange={e => setNext(e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number" />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                </button>
                <button
                    onClick={() => onSubmit(current, next)}
                    disabled={loading || !current || next.length < 8}
                    style={{
                        padding: '9px 20px', borderRadius: '8px', border: 'none',
                        background: '#2563eb', color: '#fff', fontSize: '14px',
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        opacity: loading || !current || next.length < 8 ? 0.6 : 1,
                    }}
                >
                    {loading ? 'Changing...' : 'Change password'}
                </button>
            </div>
        </>
    )
}

// Main page
export default function UsersPage() {
    const queryClient  = useQueryClient()
    const { user: me, hasRole } = useAuthStore()
    const canManage    = hasRole(['MANAGER'])

    const [showCreate,    setShowCreate]    = useState(false)
    const [editUser,      setEditUser]      = useState<User | null>(null)
    const [resetUser,     setResetUser]     = useState<User | null>(null)
    const [showChangePwd, setShowChangePwd] = useState(false)
    const [createForm,    setCreateForm]    = useState<CreateFormData>(emptyCreateForm)
    const [editForm,      setEditForm]      = useState<EditFormData>({ name: '', role: '' })
    const [formError,     setFormError]     = useState('')

    const { data, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn:  () => userApi.getAll().then(r => r.data.data || []),
    })

    const users: User[] = data || []

    // Group by role for display
    const owners       = users.filter(u => u.role === 'OWNER')
    const managers     = users.filter(u => u.role === 'MANAGER')
    const cashiers     = users.filter(u => u.role === 'CASHIER')
    const storekeepers = users.filter(u => u.role === 'STOREKEEPER')
    const grouped      = [...owners, ...managers, ...cashiers, ...storekeepers]

    //  Mutations
    const createMutation = useMutation({
        mutationFn: (f: CreateFormData) =>
            userApi.create({ name: f.name, email: f.email, password: f.password, role: f.role }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setShowCreate(false)
            setCreateForm(emptyCreateForm)
            setFormError('')
            toast.success('User created successfully')
        },
        onError: (e: any) => {
            const msg = e?.response?.data?.message || 'Failed to create user'
            setFormError(msg)
            toast.error(msg)
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, f }: { id: string; f: EditFormData }) =>
            userApi.update(id, { name: f.name, role: f.role || undefined }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setEditUser(null)
            setFormError('')
            toast.success('User updated successfully')
        },
        onError: (e: any) => {
            const msg = e?.response?.data?.message || 'Failed to update user'
            setFormError(msg)
            toast.error(msg)
        },
    })

    const deactivateMutation = useMutation({
        mutationFn: (id: string) => userApi.deactivate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('User deactivated')
        },
        onError: () => toast.error('Failed to deactivate user'),
    })

    const reactivateMutation = useMutation({
        mutationFn: (id: string) => userApi.reactivate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('User reactivated')
        },
        onError: () => toast.error('Failed to reactivate user'),
    })

    const resetPasswordMutation = useMutation({
        mutationFn: ({ id, pwd }: { id: string; pwd: string }) =>
            userApi.resetPassword(id, pwd),
        onSuccess: () => {
            setResetUser(null)
            toast.success('Password reset successfully')
        },
        onError: () => toast.error('Failed to reset password'),
    })

    const changePasswordMutation = useMutation({
        mutationFn: ({ current, next }: { current: string; next: string }) =>
            userApi.changePassword({ currentPassword: current, newPassword: next }),
        onSuccess: () => {
            setShowChangePwd(false)
            toast.success('Password changed successfully')
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to change password'),
    })

    //  Handlers
    const openEdit = (u: User) => {
        setEditForm({ name: u.name, role: u.role })
        setFormError('')
        setEditUser(u)
    }

    const handleDeactivate = (u: User) => {
        if (confirm(`Deactivate "${u.name}"? They will not be able to login.`)) {
            deactivateMutation.mutate(u.id)
        }
    }

    const handleReactivate = (u: User) => {
        if (confirm(`Reactivate "${u.name}"?`)) {
            reactivateMutation.mutate(u.id)
        }
    }

    // Render
    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: '1000px' }}>
            <style>{`
        .action-btn {
          background: none; border: none; cursor: pointer;
          padding: 6px 10px; border-radius: 6px; font-size: 12px;
          transition: background 0.15s; display: flex; align-items: center;
          gap: 4px; font-family: 'DM Sans', sans-serif;
        }
        .action-btn:hover        { background: #f1f5f9; }
        .action-btn.danger:hover { background: #fef2f2; color: #dc2626; }
        .action-btn.success:hover { background: #f0fdf4; color: #16a34a; }
      `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ color: '#0f172a', fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        Users
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                        {users.length} team members in your shop
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setShowChangePwd(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: '#fff', color: '#64748b',
                            border: '1px solid #e2e8f0', borderRadius: '8px',
                            padding: '10px 18px', fontSize: '14px',
                            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        🔑 Change my password
                    </button>
                    {canManage && (
                        <button
                            onClick={() => { setCreateForm(emptyCreateForm); setFormError(''); setShowCreate(true) }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: '#2563eb', color: '#fff',
                                border: 'none', borderRadius: '8px',
                                padding: '10px 18px', fontSize: '14px',
                                fontWeight: 500, cursor: 'pointer',
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Add user
                        </button>
                    )}
                </div>
            </div>

            {/* Role summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {[
                    { role: 'OWNER',       color: '#9333ea', count: owners.length },
                    { role: 'MANAGER',     color: '#2563eb', count: managers.length },
                    { role: 'CASHIER',     color: '#16a34a', count: cashiers.length },
                    { role: 'STOREKEEPER', color: '#ea580c', count: storekeepers.length },
                ].map(({ role, color, count }) => (
                    <div key={role} style={{
                        background: '#fff', border: '1px solid #e2e8f0',
                        borderRadius: '10px', padding: '14px 16px',
                        borderTop: `3px solid ${color}`,
                    }}>
                        <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {role}
                        </p>
                        <p style={{ color: '#0f172a', fontSize: '22px', fontWeight: 600, margin: 0 }}>
                            {count}
                        </p>
                    </div>
                ))}
            </div>

            {/* Users table */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
                        <Spinner size={24} />
                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading users...</span>
                    </div>
                ) : grouped.length === 0 ? (
                    <EmptyState title="No users found" sub="Add your first team member to get started" />
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            {['User', 'Email', 'Role', 'Status', 'Joined', ''].map(h => (
                                <th key={h} style={{
                                    textAlign: 'left', padding: '12px 16px',
                                    color: '#94a3b8', fontSize: '12px', fontWeight: 500,
                                    borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {grouped.map(u => (
                            <tr key={u.id} style={{ opacity: u.isActive ? 1 : 0.6 }}>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Avatar name={u.name} role={u.role} />
                                        <div>
                                            <p style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>
                                                {u.name}
                                                {u.id === me?.id && (
                                                    <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', marginLeft: '6px' }}>
                              You
                            </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                    <span style={{ color: '#64748b', fontSize: '13px' }}>{u.email}</span>
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                    <RoleBadge role={u.role} />
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{
                        background: u.isActive ? '#f0fdf4' : '#f1f5f9',
                        color:      u.isActive ? '#16a34a' : '#94a3b8',
                        fontSize: '11px', fontWeight: 500,
                        padding: '2px 8px', borderRadius: '20px',
                    }}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                      {formatDate(u.createdAt)}
                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc' }}>
                                    {canManage && u.id !== me?.id && u.role !== 'OWNER' && (
                                        <div style={{ display: 'flex', gap: '2px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                            <button className="action-btn" onClick={() => openEdit(u)}>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                                Edit
                                            </button>
                                            <button className="action-btn" onClick={() => setResetUser(u)}>
                                                🔑 Reset pwd
                                            </button>
                                            {u.isActive ? (
                                                <button className="action-btn danger" onClick={() => handleDeactivate(u)}>
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button className="action-btn success" onClick={() => handleReactivate(u)}>
                                                    Reactivate
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create modal */}
            {showCreate && (
                <Modal title="Add team member" onClose={() => setShowCreate(false)}>
                    {formError && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
                            {formError}
                        </div>
                    )}
                    <CreateUserForm
                        form={createForm}
                        onChange={setCreateForm}
                        onSubmit={() => createMutation.mutate(createForm)}
                        onClose={() => setShowCreate(false)}
                        loading={createMutation.isPending}
                    />
                </Modal>
            )}

            {/* Edit modal */}
            {editUser && (
                <Modal title="Edit user" onClose={() => setEditUser(null)}>
                    {formError && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
                            {formError}
                        </div>
                    )}
                    <EditUserForm
                        form={editForm}
                        onChange={setEditForm}
                        onSubmit={() => updateMutation.mutate({ id: editUser.id, f: editForm })}
                        onClose={() => setEditUser(null)}
                        loading={updateMutation.isPending}
                        isOwner={editUser.role === 'OWNER'}
                    />
                </Modal>
            )}

            {/* Reset password modal */}
            {resetUser && (
                <Modal title={`Reset password — ${resetUser.name}`} onClose={() => setResetUser(null)}>
                    <ResetPasswordForm
                        onSubmit={pwd => resetPasswordMutation.mutate({ id: resetUser.id, pwd })}
                        onClose={() => setResetUser(null)}
                        loading={resetPasswordMutation.isPending}
                    />
                </Modal>
            )}

            {/* Change own password modal */}
            {showChangePwd && (
                <Modal title="Change my password" onClose={() => setShowChangePwd(false)}>
                    <ChangePasswordForm
                        onSubmit={(current, next) => changePasswordMutation.mutate({ current, next })}
                        onClose={() => setShowChangePwd(false)}
                        loading={changePasswordMutation.isPending}
                    />
                </Modal>
            )}
        </div>
    )
}