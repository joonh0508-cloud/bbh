import { redirect } from "next/navigation";

export default function ProgramsPage() {
  // 수학 프로그램 탭을 누르면 기본적으로 가장 첫 번째 프로그램인 거리-속력-시간으로 이동합니다.
  redirect("/programs/dst");
}
