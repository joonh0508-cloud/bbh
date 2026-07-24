export interface MajorUnit {
  name: string;
  subUnits: string[];
}

export interface GradeData {
  gradeName: string;
  majorUnits: MajorUnit[];
}

export interface CurriculumData {
  id: "2015" | "2022";
  name: string;
  grades: GradeData[];
}

export fontData = {};

export const curriculumList: CurriculumData[] = [
  {
    id: "2015",
    name: "2015 개정 교육과정",
    grades: [
      {
        gradeName: "중학교 1학년",
        majorUnits: [
          {
            name: "I. 수와 연산",
            subUnits: ["1. 소인수분해", "2. 정수와 유리수"],
          },
          {
            name: "II. 문자와 식",
            subUnits: ["1. 문자의 사용과 식의 계산", "2. 일차방정식과 그 활용"],
          },
          {
            name: "III. 좌표평면과 그래프",
            subUnits: ["1. 좌표평면과 그래프", "2. 정비례와 반비례"],
          },
          {
            name: "IV. 기본 도형과 평면도형",
            subUnits: ["1. 기본 도형", "2. 평면도형의 성질"],
          },
          {
            name: "V. 입체도형과 통계",
            subUnits: ["1. 입체도형의 성질", "2. 자료의 정리와 해석"],
          },
        ],
      },
      {
        gradeName: "중학교 2학년",
        majorUnits: [
          {
            name: "I. 유리수와 순환소수",
            subUnits: ["1. 유리수와 순환소수"],
          },
          {
            name: "II. 식의 계산",
            subUnits: ["1. 단항식과 다항식의 계산", "2. 부등식과 연립방정식"],
          },
          {
            name: "III. 일차함수",
            subUnits: ["1. 일차함수와 그래프", "2. 일차함수와 일차방정식의 관계"],
          },
          {
            name: "IV. 도형의 성질",
            subUnits: ["1. 삼각형의 성질", "2. 사각형의 성질"],
          },
          {
            name: "V. 도형의 닮음과 확률",
            subUnits: ["1. 도형의 닮음과 피타고라스 정리", "2. 확률과 그 계산"],
          },
        ],
      },
      {
        gradeName: "중학교 3학년",
        majorUnits: [
          {
            name: "I. 실수와 그 연산",
            subUnits: ["1. 제곱근과 실수", "2. 근호를 포함한 식의 계산"],
          },
          {
            name: "II. 인수분해와 이차방정식",
            subUnits: ["1. 다항식의 곱셈과 인수분해", "2. 이차방정식과 그 활용"],
          },
          {
            name: "III. 이차함수",
            subUnits: ["1. 이차함수와 그 그래프"],
          },
          {
            name: "IV. 삼각비와 원의 성질",
            subUnits: ["1. 삼각비", "2. 원의 성질"],
          },
          {
            name: "V. 통계",
            subUnits: ["1. 대푯값과 산포도", "2. 상관관계"],
          },
        ],
      },
      {
        gradeName: "고등학교 (수학 I / II / 공통)",
        majorUnits: [
          {
            name: "I. 다항식 & 방정식",
            subUnits: ["1. 다항식의 연산과 인수분해", "2. 복소수와 이차방정식", "3. 이차함수와 여러 가지 방정식"],
          },
          {
            name: "II. 지수함수와 로그함수 (수학I)",
            subUnits: ["1. 지수와 로그", "2. 지수함수와 로그함수"],
          },
          {
            name: "III. 삼각함수와 수열 (수학I)",
            subUnits: ["1. 삼각함수", "2. 등차수열과 등비수열", "3. 수열의 합과 수학적 귀납법"],
          },
          {
            name: "IV. 미분과 적분 (수학II)",
            subUnits: ["1. 함수의 극한과 연속", "2. 다항함수의 미분법", "3. 다항함수의 적분법"],
          },
          {
            name: "V. 확률과 통계 / 미적분",
            subUnits: ["1. 순열과 조합", "2. 확률", "3. 통계적 추정", "4. 미적분 (수열의 극한 및 여러 가지 미적분)"],
          },
        ],
      },
    ],
  },
  {
    id: "2022",
    name: "2022 개정 교육과정",
    grades: [
      {
        gradeName: "중학교 1학년 (2022 개정)",
        majorUnits: [
          {
            name: "I. 수와 연산",
            subUnits: ["1. 소인수분해", "2. 정수와 유리수"],
          },
          {
            name: "II. 변화와 관계 (문자와 식, 함수)",
            subUnits: ["1. 문자의 사용과 식의 계산", "2. 일차방정식", "3. 정비례와 반비례"],
          },
          {
            name: "III. 도형과 측정",
            subUnits: ["1. 기본 도형", "2. 평면도형과 입체도형의 성질"],
          },
          {
            name: "IV. 자료와 가능성 (통계)",
            subUnits: ["1. 자료의 정리와 해석 (대푯값 포함)"],
          },
        ],
      },
      {
        gradeName: "중학교 2학년 (2022 개정)",
        majorUnits: [
          {
            name: "I. 수와 연산 & 식의 계산",
            subUnits: ["1. 유리수와 순환소수", "2. 식의 계산"],
          },
          {
            name: "II. 방정식과 부등식, 일차함수",
            subUnits: ["1. 일차부등식", "2. 연립일차방정식", "3. 일차함수와 그래프"],
          },
          {
            name: "III. 도형과 측정",
            subUnits: ["1. 삼각형과 사각형의 성질", "2. 도형의 닮음과 피타고라스 정리"],
          },
          {
            name: "IV. 자료와 가능성",
            subUnits: ["1. 확률과 그 계산"],
          },
        ],
      },
      {
        gradeName: "중학교 3학년 (2022 개정)",
        majorUnits: [
          {
            name: "I. 실수와 그 연산",
            subUnits: ["1. 제곱근과 실수", "2. 근호를 포함한 식의 계산"],
          },
          {
            name: "II. 인수분해와 이차방정식, 이차함수",
            subUnits: ["1. 인수분해", "2. 이차방정식", "3. 이차함수와 그 그래프"],
          },
          {
            name: "III. 도형과 측정",
            subUnits: ["1. 삼각비", "2. 원의 성질"],
          },
          {
            name: "IV. 자료와 가능성",
            subUnits: ["1. 대푯값과 산포도", "2. 상자수염과 상자그림 (2022 신설)", "3. 상관관계"],
          },
        ],
      },
      {
        gradeName: "고등학교 (공통수학 1 / 2 & 선택)",
        majorUnits: [
          {
            name: "I. 공통수학 1 (2022 신설 체계)",
            subUnits: ["1. 다항식", "2. 방정식과 부등식", "3. 행렬 (2022 부활)", "4. 경우의 수"],
          },
          {
            name: "II. 공통수학 2",
            subUnits: ["1. 도형의 방정식", "2. 집합과 명제", "3. 함수와 유리·무리함수"],
          },
          {
            name: "III. 대수 (구 수학I)",
            subUnits: ["1. 지수함수와 로그함수", "2. 삼각함수", "3. 수열"],
          },
          {
            name: "IV. 미적분 I (구 수학II)",
            subUnits: ["1. 함수의 극한과 연속", "2. 미분법", "3. 적분법"],
          },
          {
            name: "V. 확률과 통계 / 미적분 II",
            subUnits: ["1. 확률과 통계", "2. 미적분 II (수열의 극한 및 미적분)", "3. 기하"],
          },
        ],
      },
    ],
  },
];
