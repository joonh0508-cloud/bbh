"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Database, Paperclip, Trash2, Download, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  file_name?: string | null;
  file_url?: string | null;
  created_at: string;
}

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 폼 상태 (첨부파일 포함)
  const [newPost, setNewPost] = useState({ title: "", author: "", content: "" });
  const [attachedFile, setAttachedFile] = useState<{ name: string; url: string } | null>(null);

  // 삭제용 비밀번호 모달 상태
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch error:", error.message);
        const storedPosts = localStorage.getItem("math-app-board");
        if (storedPosts) setPosts(JSON.parse(storedPosts));
      } else if (data) {
        setPosts(data as Post[]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 파일 선택 처리 (Data URL 변환)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB 용량 제한 안내
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 최대 5MB까지 업로드 가능합니다.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFile({
        name: file.name,
        url: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.author || !newPost.content) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: newPost.title,
        author: newPost.author,
        content: newPost.content,
        file_name: attachedFile ? attachedFile.name : null,
        file_url: attachedFile ? attachedFile.url : null,
      };

      const { data, error } = await supabase
        .from("posts")
        .insert([payload])
        .select();

      if (error) {
        alert(`Supabase 저장 실패: ${error.message}`);
        // 로컬스토리지 백업 저장
        const localPost: Post = {
          id: Date.now().toString(),
          ...payload,
          created_at: new Date().toISOString(),
        };
        const updated = [localPost, ...posts];
        setPosts(updated);
        localStorage.setItem("math-app-board", JSON.stringify(updated));
      } else if (data) {
        setPosts([data[0] as Post, ...posts]);
      }
    } catch (err) {
      console.error("Error inserting post:", err);
    } finally {
      setIsSubmitting(false);
      setNewPost({ title: "", author: "", content: "" });
      setAttachedFile(null);
      setIsFormOpen(false);
    }
  };

  // 삭제 실행 (관리자 비밀번호 확인)
  const handleDeletePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePassword !== "admin123") {
      setDeleteError("비밀번호가 올바르지 않습니다. 관리자만 삭제 가능합니다.");
      return;
    }

    if (!deleteTargetId) return;

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", deleteTargetId);

      if (error) {
        alert(`삭제 실패: ${error.message}`);
      } else {
        setPosts((prev) => prev.filter((p) => p.id !== deleteTargetId));
        alert("게시글이 삭제되었습니다.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setDeleteTargetId(null);
      setDeletePassword("");
      setDeleteError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 상단 헤더 영역 */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              메인으로
            </Link>
            <div className="h-4 w-px bg-gray-200"></div>
            <h1 className="text-lg font-semibold text-[#1d1d1f] tracking-tight">
              자료실
            </h1>
          </div>
          
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1d1d1f] text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            {isFormOpen ? "취소" : <><Plus className="w-4 h-4" />글쓰기</>}
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        
        {/* Supabase 연결 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 text-sm text-blue-700 flex items-start gap-3">
          <Database className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
          <p>
            현재 자료실은 <b>Supabase 실시간 클라우드 DB</b>와 연동되어 있습니다. <br className="hidden md:block" />
            자료 등록 시 <b>첨부파일(문서, 이미지 등)</b>을 함께 업로드할 수 있으며, 삭제는 관리자 권한으로만 가능합니다.
          </p>
        </div>

        {/* 글쓰기 폼 */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ease-out">
            <h2 className="text-lg font-bold text-[#1d1d1f] mb-2">새로운 자료 등록</h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="글 제목"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="flex-[3] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f]"
              />
              <input
                type="text"
                placeholder="작성자 이름"
                value={newPost.author}
                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                className="flex-[1] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f]"
              />
            </div>
            
            <textarea
              placeholder="내용을 입력하세요..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] resize-none"
            />

            {/* 첨부파일 선택 입력 */}
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="file"
                onChange={handleFileChange}
                className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-[#1d1d1f] file:shadow-xs hover:file:bg-gray-100 cursor-pointer"
              />
              {attachedFile && (
                <span className="text-xs text-blue-600 font-semibold truncate max-w-[200px]">
                  ✓ {attachedFile.name}
                </span>
              )}
            </div>
            
            <div className="flex justify-end mt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </form>
        )}

        {/* 게시글 목록 */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="text-center py-20 text-gray-400">
              게시글을 불러오는 중입니다...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              아직 등록된 자료가 없습니다. 첫 번째 자료를 작성해 보세요!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
                
                {/* 상단 제목 및 삭제 버튼 */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-bold text-[#1d1d1f]">{post.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    {/* 관리자 전용 삭제 버튼 */}
                    <button
                      onClick={() => {
                        setDeleteTargetId(post.id);
                        setDeletePassword("");
                        setDeleteError("");
                      }}
                      className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                      title="관리자 전용 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 내용 */}
                <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">
                  {post.content}
                </p>

                {/* 첨부파일 다운로드 바 */}
                {post.file_url && post.file_name && (
                  <div className="mb-4 inline-flex items-center gap-2 bg-blue-50/70 border border-blue-100 px-3 py-2 rounded-xl text-xs">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">{post.file_name}</span>
                    <a
                      href={post.file_url}
                      download={post.file_name}
                      className="ml-2 flex items-center gap-1 text-blue-600 font-bold hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      다운로드
                    </a>
                  </div>
                )}

                {/* 작성자 정보 */}
                <div className="text-xs font-medium text-gray-500 pt-2 border-t border-gray-50">
                  작성자: <span className="text-[#1d1d1f]">{post.author}</span>
                </div>

              </div>
            ))
          )}
        </div>

      </main>

      {/* 관리자 삭제 확인 비밀번호 모달 */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form onSubmit={handleDeletePost} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[#1d1d1f] text-center">관리자 삭제 인증</h3>
            <p className="text-xs text-gray-500 text-center">
              게시글 삭제는 관리자만 가능합니다. <br /> 비밀번호를 입력해 주세요.
            </p>
            <input
              type="password"
              placeholder="관리자 비밀번호 (admin123)"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f]"
              autoFocus
            />
            {deleteError && <p className="text-xs text-red-500 text-center">{deleteError}</p>}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 shadow-sm"
              >
                삭제하기
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
