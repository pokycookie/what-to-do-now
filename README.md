# What to do now? (지금 뭐하지?)

지금 뭐하지 앱은 할 일은 많은데 지금 당장 뭘하는게 가장 효율적일지 모르겠고, 생각하기도 싫은 당신을 위해 당장 할 일 우선순위를 정해줍니다.

## Priority (우선순위)

### Parameters

- [ ] **_Urgency(긴급도)_**: 자동 계산되는 내부 지표 (TimeTaken / AT); 높을수록 긴급함(음수는 지난일)
- [x] **Importance(중요도)**: 사용자가 지정하는 중요한 정도
- [x] **TimeTaken(소요시간)**: 계획된 일을 완벽하게 끝내는데 필요한 예상 시간
      (현재시간과 예정시간, 그리고 소요시간을 이용해 긴급도를 결정함. 따라서 정말 중요한 일일수록 소요시간을 넉넉하게 잡는것이 긴급도를 높이는데 도움이 됨)
- [x] **Deadline**: 계획된 일을 끝내야 하는 마감 시간(날짜, 시간)
- [ ] **AT(Available Time; 가용시간)**: 현재시간부터 DeadLine까지의 시간 중 FixedTask를 뺀 차이 (실질적으로 활용 가능한 시간)
- [ ] FixedTask: 실행 여부를 확인하지 않고, 시간을 차지하는 역할 ex) 잠, 밥, 결혼식 등
- [ ] Weight(가중치): 반복 할 일에만 해당되는 내부 지표. 오래 방치할수록 자동으로 가중치가 늘어나는 방식

### Set priority

1. 긴급도 high + 중요도 high
2. 긴급도 high + 중요도 low
3. 긴급도 low + 중요도 high
4. 긴급도 low + 중요도 low

### 예외상황

Q1. (긴급도 high + 중요도 low)인 일을 해서 (긴급도 low + 중요도 high)인 일을 할 시간이 없어질 때

A1. 해당 문제를 인지하여 중요도가 낮은 일을 포기하고 중요도가 높은 일을 먼저 처리하도록 설정

### Urgency logic

**_urgency = timeTaken / AT_**

1. 현재시간부터 deadLine까지의 시간 차이를 계산
2. 현재시간과 deadLine사이에 FixedTask가 있다면 그만큼 시간을 뺌
3. timeTaken에 구해진 AT를 나누어 urgency 계산

### Logic

1. 각 할 일의 urgency를 모두 배열화
2. urgency가 1이상인 할 일의 경우 이미 가망이 없는 상태로 분리
3. urgency가 1이하인 요소들에 대해서만 높은순으로 정렬(sort) + 중요도 역시 높은 순으로 정렬
4. 정렬된 배열을 순서대로 하나씩 타임라인에 열거 (즉, 긴급도가 높은 순으로 먼저 하도록 보여줌)
5.

```ts
const data: IData[] = getData(today()); // Get today's data

const availableTime = getAvailableTime(today()); // 하루 가용시간의 합
const timeTakenTotal = data.reduce(...); // 하루 할 일 소요시간의 합

if (availableTime < timeTakenTotal) {
    // 오늘 할 일 중에서 뭔가를 포기해야 함
} else {

}
```

## DB

### Data interface

```ts
interface ITask {
  content: string;
  importance: number;
  timeTaken: number; // 분 기준
  updated: Date;
  deadLine?: Date;
  urgency?: number;
  weight?: number;
}
```

```ts
interface IFixedTask {
  content: string;
  startTime: Date;
  endTime: Date;
  updated: Date;
  repeatType?: TRepeatType;
  repeat?: any;
}
```

```ts
export interface ITime {
  hour: number;
  minute: number;
}
```
