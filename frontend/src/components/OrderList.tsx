// import api from "../api";

// import { PurchaseType } from "./Order";

// export function OrderList({ purchases, refresh }: { purchases: PurchaseType[]; refresh: () => void }) {
//     const handleUpdateStatus = async (id: string, status: string) => {
//         try {
//             await api.put(`/api/purchase/update_status/${id}`, { status });
//             refresh(); // 通知父组件刷新数据
//         } catch (err) {
//             alert("操作失败");
//             console.error(err);
//         }
//     };

//     return (
//         <table className="table table-bordered">
//             <thead>
//                 <tr>
//                     <th>ID</th>
//                     <th>书籍ID</th>
//                     <th>数量</th>
//                     <th>进价</th>
//                     <th>状态</th>
//                     <th>创建时间</th>
//                     <th>操作</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {purchases.map((purchase) => (
//                     <tr key={purchase.id}>
//                         <td>{purchase.id}</td>
//                         <td>{purchase.book_id}</td>
//                         <td>{purchase.quantity}</td>
//                         <td>{purchase.purchasing_price}</td>
//                         <td>{purchase.status}</td>
//                         <td>{purchase.created_at}</td>
//                         <td>
//                             {purchase.status === "unpaid" && (
//                                 <button
//                                     className="btn btn-success btn-sm me-2"
//                                     onClick={() =>
//                                         handleUpdateStatus(purchase.id, "paid")
//                                     }
//                                 >
//                                     💰付款
//                                 </button>
//                             )}
//                             {purchase.status !== "returned" && (
//                                 <button
//                                     className="btn btn-danger btn-sm"
//                                     onClick={() =>
//                                         handleUpdateStatus(
//                                             purchase.id,
//                                             "returned"
//                                         )
//                                     }
//                                 >
//                                     🔁退货
//                                 </button>
//                             )}
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     );
// }
