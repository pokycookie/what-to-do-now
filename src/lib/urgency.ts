// import { Time } from "./time";
// import { IFixedTask } from "./type";

// export function getAT(fixedTask: IFixedTask[], current: Date, deadline?: Date) {
//   const prev = new Time(current);

//   if (deadline) {
//     const next = new Time(deadline);
//     const FTR = checkFixedTask(fixedTask, current, deadline);
//     return next.diff(prev, "minutes");
//   } else {
//     return Infinity;
//   }
// }

// export function checkFixedTask(
//   fixedTask: IFixedTask[],
//   current: Date,
//   deadline: Date
// ) {
//   let accTime: number = 0;

//   fixedTask.forEach((element) => {
//     switch (element.repeatType) {
//       case undefined:
//         if (innerChecker(element, current, deadline)) {
//           accTime += getInnerTime(element, current, deadline);
//           console.log(accTime);
//         }
//         break;
//       case "daily":
//         break;
//       case "monthly":
//         break;
//       case "weekly":
//         break;
//       case "yearly":
//         break;
//     }
//   });
// }

// function innerChecker(element: IFixedTask, current: Date, deadline: Date) {
//   if (
//     (element.startTime < current && element.endTime > current) ||
//     (element.startTime > current && element.startTime < deadline) ||
//     (element.endTime > deadline && element.startTime < deadline)
//   ) {
//     return true;
//   } else return false;
// }

// function getInnerTime(element: IFixedTask, current: Date, deadline: Date) {
//   if (element.startTime < current) {
//     if (element.endTime < deadline) {
//       return moment(element.endTime).diff(moment(current), "minutes");
//     } else {
//       return moment(deadline).diff(moment(current), "minutes");
//     }
//   } else {
//     if (element.endTime < deadline) {
//       return moment(element.endTime).diff(moment(element.startTime), "minutes");
//     } else {
//       return moment(deadline).diff(moment(element.startTime), "minutes");
//     }
//   }
// }

export default function temp() {}
