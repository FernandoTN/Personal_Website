'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  authorName: string
  authorEmail: string
  content: string
  status: 'PENDING' | 'APPROVED' | 'SPAM'
  createdAt: string
  post: {
    id: string
    title: string
    slug: string
  }
}

type FilterStatus = 'all' | 'PENDING' | 'APPROVED' | 'SPAM'

const Icons = {
  Check: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Spam: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  Comment: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${type === 'success' ? 'bg-accent-success text-white' : 'bg-accent-error text-white'}`}>
      {type === 'success' ? <Icons.Check /> : <Icons.X />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75"><Icons.X /></button>
    </div>
  )
}

function CommentRow({ comment, onApprove, onReject, onSpam, onDelete, isLoading }: { comment: Comment; onApprove: (id: string) => void; onReject: (id: string) => void; onSpam: (id: string) => void; onDelete: (id: string) => void; isLoading: boolean }) {
  const statusColors = { PENDING: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20', APPROVED: 'bg-accent-success/10 text-accent-success border-accent-success/20', SPAM: 'bg-accent-error/10 text-accent-error border-accent-error/20' }
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark p-5 hover:shadow-light dark:hover:shadow-glow transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-semibold">{comment.authorName.charAt(0).toUpperCase()}</div>
          <div>
            <p className="font-medium text-text-primary dark:text-text-dark-primary">{comment.authorName}</p>
            <p className="text-sm text-text-muted dark:text-text-dark-muted">{comment.authorEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors[comment.status]}`}>{comment.status}</span>
          <span className="text-sm text-text-muted dark:text-text-dark-muted">{formatDate(comment.createdAt)}</span>
        </div>
      </div>
      <div className="mb-4 p-4 bg-light-icy-blue dark:bg-dark-deep-blue rounded-lg">
        <p className="text-text-primary dark:text-text-dark-primary whitespace-pre-wrap">{comment.content}</p>
      </div>
      <div className="mb-4 text-sm">
        <span className="text-text-muted dark:text-text-dark-muted">On post: </span>
        <a href={`/blog/${comment.post.slug}`} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">{comment.post.title}</a>
      </div>
      <div className="flex flex-wrap gap-2">
        {comment.status !== 'APPROVED' && <button onClick={() => onApprove(comment.id)} disabled={isLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-accent-success/10 text-accent-success hover:bg-accent-success/20 transition-colors disabled:opacity-50"><Icons.Check />Approve</button>}
        {comment.status !== 'SPAM' && <button onClick={() => onSpam(comment.id)} disabled={isLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-accent-warning/10 text-accent-warning hover:bg-accent-warning/20 transition-colors disabled:opacity-50"><Icons.Spam />Mark as Spam</button>}
        {comment.status === 'APPROVED' && <button onClick={() => onReject(comment.id)} disabled={isLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-accent-error/10 text-accent-error hover:bg-accent-error/20 transition-colors disabled:opacity-50"><Icons.X />Reject</button>}
        <button onClick={() => onDelete(comment.id)} disabled={isLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-accent-error/10 text-accent-error hover:bg-accent-error/20 transition-colors disabled:opacity-50"><Icons.Trash />Delete</button>
      </div>
    </div>
  )
}

function FilterTabs({ current, onChange, counts }: { current: FilterStatus; onChange: (status: FilterStatus) => void; counts: { all: number; pending: number; approved: number; spam: number } }) {
  const tabs: { value: FilterStatus; label: string; count: number }[] = [{ value: 'all', label: 'All', count: counts.all }, { value: 'PENDING', label: 'Pending', count: counts.pending }, { value: 'APPROVED', label: 'Approved', count: counts.approved }, { value: 'SPAM', label: 'Spam', count: counts.spam }]
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button key={tab.value} onClick={() => onChange(tab.value)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${current === tab.value ? 'bg-accent-primary text-white' : 'bg-light-neutral-grey dark:bg-dark-deep-blue text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-panel'}`}>
          {tab.label}<span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${current === tab.value ? 'bg-white/20' : 'bg-border-light dark:bg-border-dark'}`}>{tab.count}</span>
        </button>
      ))}
    </div>
  )
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [filter, setFilter] = useState<FilterStatus>('PENDING')
  const [isLoading, setIsLoading] = useState(true)
  const [isActing, setIsActing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/comments')
      if (!res.ok) throw new Error('Failed to fetch comments')
      const data = await res.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
      setToast({ message: 'Failed to load comments', type: 'error' })
    } finally { setIsLoading(false) }
  }

  useEffect(() => { if (status === 'authenticated') fetchComments() }, [status])

  const handleApprove = async (id: string) => {
    setIsActing(true)
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'APPROVED' }) })
      if (!res.ok) throw new Error('Failed to approve comment')
      setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'APPROVED' } : c))
      setToast({ message: 'Comment approved successfully', type: 'success' })
    } catch (error) { console.error('Error approving comment:', error); setToast({ message: 'Failed to approve comment', type: 'error' }) }
    finally { setIsActing(false) }
  }

  const handleReject = async (id: string) => {
    setIsActing(true)
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'PENDING' }) })
      if (!res.ok) throw new Error('Failed to reject comment')
      setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'PENDING' } : c))
      setToast({ message: 'Comment rejected', type: 'success' })
    } catch (error) { console.error('Error rejecting comment:', error); setToast({ message: 'Failed to reject comment', type: 'error' }) }
    finally { setIsActing(false) }
  }

  const handleSpam = async (id: string) => {
    setIsActing(true)
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'SPAM' }) })
      if (!res.ok) throw new Error('Failed to mark comment as spam')
      setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'SPAM' } : c))
      setToast({ message: 'Comment marked as spam', type: 'success' })
    } catch (error) { console.error('Error marking comment as spam:', error); setToast({ message: 'Failed to mark comment as spam', type: 'error' }) }
    finally { setIsActing(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this comment?')) return
    setIsActing(true)
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete comment')
      setComments(prev => prev.filter(c => c.id !== id))
      setToast({ message: 'Comment deleted permanently', type: 'success' })
    } catch (error) { console.error('Error deleting comment:', error); setToast({ message: 'Failed to delete comment', type: 'error' }) }
    finally { setIsActing(false) }
  }

  const filteredComments = filter === 'all' ? comments : comments.filter(c => c.status === filter)
  const counts = { all: comments.length, pending: comments.filter(c => c.status === 'PENDING').length, approved: comments.filter(c => c.status === 'APPROVED').length, spam: comments.filter(c => c.status === 'SPAM').length }

  if (status === 'loading') return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" /></div>
  if (status === 'unauthenticated') return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">Comments</h1>
          <p className="mt-1 text-text-secondary dark:text-text-dark-secondary">Moderate and manage blog comments</p>
        </div>
        <button onClick={fetchComments} disabled={isLoading} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-light-neutral-grey dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary hover:bg-light-icy-blue dark:hover:bg-dark-panel transition-colors disabled:opacity-50"><Icons.Refresh />Refresh</button>
      </div>

      <FilterTabs current={filter} onChange={setFilter} counts={counts} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" /></div>
      ) : filteredComments.length === 0 ? (
        <div className="text-center py-12 bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-light-neutral-grey dark:bg-dark-deep-blue mb-4"><Icons.Comment /></div>
          <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary mb-1">No comments found</h3>
          <p className="text-text-muted dark:text-text-dark-muted">{filter === 'PENDING' ? 'No pending comments to moderate' : filter === 'APPROVED' ? 'No approved comments yet' : filter === 'SPAM' ? 'No spam comments' : 'No comments have been submitted yet'}</p>
        </div>
      ) : (
        <div className="space-y-4">{filteredComments.map((comment) => (<CommentRow key={comment.id} comment={comment} onApprove={handleApprove} onReject={handleReject} onSpam={handleSpam} onDelete={handleDelete} isLoading={isActing} />))}</div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
