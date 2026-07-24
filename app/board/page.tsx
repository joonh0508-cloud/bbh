"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, MessageSquare } from "lucide-react";

interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
}

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", author: "", content: "" });

  useEffect(() => {
    // 로컬 스토리지에서 게시글 불러오기
    const storedPosts = localStorage.getItem("math-app-board");
    if (storedPosts) {
      try {
        setPosts(JSON.parse(storedPosts));
      } catch (e) {
        console.error("Failed to parse board data", e);
      }
    } else {
      // 초기 샘플 데이터
      const initialPosts: Post[] = [
        {
          id: "1",
          title: "첫 번째 자료입니다.",
          author: "채채 선생님",
          content: "이곳은 누구나 자유롭게 자료와 질문을 올릴 수 있는 공간입니다.\n유용하게 사용해 주세요!",
          createdAt: new Date().toISOString(),
        }
      ];
      setPosts(initialPosts);
      localStorage.setItem("math-app-board", JSON.stringify(initialPosts));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.author || !newPost.content) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      author: newPost.author,
      content: newPost.content,
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("math-app-board", JSON.stringify(updatedPosts));
    
    // 폼 초기화 및 닫기
    setNewPost({ title: "", author: "", content: "" });
    setIsFormOpen(false);
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
            className="flex items-center gap-2 px-4 py-2 bg-[#1d1d1f] text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {isFormOpen ? "취소" : <><Plus className="w-4 h-4" />글쓰기</>}
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        
        {/* 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 text-sm text-blue-700 flex items-start gap-3">
          <MessageSquare className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
          <p>
            현재 자료실은 <b>로컬 모드</b>로 동작하고 있습니다. <br className="hidden md:block" />
            (선생님의 기기에서 작성한 글은 이 기기에서만 보이며, 향후 데이터베이스(DB) 연결 시 모든 사용자와 공유할 수 있습니다.)
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
            
            <div className="flex justify-end mt-2">
              <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                등록하기
              </button>
            </div>
          </form>
        )}

        {/* 게시글 목록 */}
        <div className="flex flex-col gap-4">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              아직 등록된 자료가 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#1d1d1f]">{post.title}</h3>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">
                  {post.content}
                </p>
                <div className="text-xs font-medium text-gray-500">
                  작성자: <span className="text-[#1d1d1f]">{post.author}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
