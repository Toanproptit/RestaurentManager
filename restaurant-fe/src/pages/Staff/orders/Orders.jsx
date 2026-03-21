import { useState, useMemo, useEffect } from "react";
import "../../../styles/Orders.css";
import {
  categories,
  quickDiscounts,
  formatCurrency,
  statusTone,
} from "./orderData";
import { getTables, updateTable } from "../../../service/table";
import { getFood } from "../../../service/food";
import { getOrders, createOrder, updateOrder, getOrderById, deleteOrder } from "../../../service/order";
import { addOrderDetail, updateOrderDetail, removeOrderDetail } from "../../../service/orderDetail";
import { createInvoiceForOrder } from "../../../service/invoice";
import OrdersListStep from "./OrdersListStep";
import OrdersTableStep from "./OrdersTableStep";
import OrdersMenuPanel from "./OrdersMenuPanel";
import OrdersSummary from "./OrdersSummary";
import OrderInvoiceModal from "./OrderInvoiceModal";

export default function Orders() {
  const ORDERS_PAGE_SIZE = 3;

  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Food pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Orders pagination
  const [ordersPage, setOrdersPage] = useState(0);
  const [ordersTotalPages, setOrdersTotalPages] = useState(0);

  const [isNewOrder, setIsNewOrder] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const loadData = async (currentPage = page, currentOrdersPage = ordersPage) => {
    try {
      const [tablesRes, foodsRes, ordersRes] = await Promise.all([
        getTables(0, 100),
        getFood(currentPage, 6),
        getOrders(0, 200)
      ]);
      if (tablesRes?.status === 200) {
        setTables(tablesRes.data.result.content || []);
      }
      if (ordersRes?.status === 200) {
        const allOrders = ordersRes.data.result.content || [];
        const pendingOrders = allOrders.filter((order) => order.status === "PENDING");
        const startIndex = currentOrdersPage * ORDERS_PAGE_SIZE;
        const endIndex = startIndex + ORDERS_PAGE_SIZE;

        setOrders(pendingOrders.slice(startIndex, endIndex));
        setOrdersTotalPages(Math.ceil(pendingOrders.length / ORDERS_PAGE_SIZE));
        setOrdersPage(currentOrdersPage);
      }
      if (foodsRes?.status === 200) {
        const data = foodsRes.data.result;
        const rawFoods = data.content || [];
        setTotalPages(data.totalPages || 0);
        setPage(currentPage);
        const enriched = rawFoods.map((item, index) => ({
          ...item,
          category: ["Main", "Rice", "Drink", "Premium"][index % 4],
          prepTime: 8 + index * 3,
          spicyLevel: ["Mild", "Medium", "Chef's special"][index % 3],
          featured: index === 1 || index === 3,
        }));
        setMenuItems(enriched);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    loadData(0);
  }, []);

  const addFood = (food, quantity = 1) => {
    const normalizedQty = Number.isFinite(Number(quantity))
      ? Math.max(1, Math.floor(Number(quantity)))
      : 1;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === food.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === food.id ? { ...item, qty: item.qty + normalizedQty } : item
        );
      }
      return [...prevCart, { ...food, qty: normalizedQty }];
    });
  };

  const decrease = (foodId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === foodId ? { ...item, qty: Math.max(0, item.qty - 1) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setActiveStep(3);
  };

  const handleSelectOrder = async (order) => {
    let resolvedOrder = order;

    try {
      const hasTable = Boolean(order?.diningTable) || Boolean(order?.diningTables?.length);
      const needsHydrate = !hasTable || !order?.orderDetails;
      if (needsHydrate && order?.id) {
        const detailRes = await getOrderById(order.id);
        if (detailRes?.status === 200) {
          resolvedOrder = detailRes.data.result;
        }
      }
    } catch (error) {
      console.error("Failed to get order detail:", error);
    }

    setSelectedOrder(resolvedOrder);
    setActiveOrderId(resolvedOrder?.id || null);

    if (resolvedOrder?.diningTable) {
      setSelectedTable(resolvedOrder.diningTable);
    } else if (resolvedOrder?.diningTables && resolvedOrder.diningTables.length > 0) {
      setSelectedTable(resolvedOrder.diningTables[0]);
    } else {
      setSelectedTable(null);
    }

    if (resolvedOrder?.orderDetails) {
      setCart(resolvedOrder.orderDetails.map((detail) => ({ ...detail.food, qty: detail.quantity })));
    } else {
      setCart([]);
    }

    setActiveStep(3); 
    setIsNewOrder(false);
  };

  const handleCreateNewOrder = async () => {
    handleReset();
    setIsNewOrder(true);
    setActiveStep(2);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa Order #${orderId}?`)) return;
    try {
      await deleteOrder(orderId);
      await loadData(page, 0); 
    } catch (e) {
      console.error("Failed to delete order:", e);
      alert("Lỗi khi xóa Order.");
    }
  };



  const handleReset = () => {
    setSelectedOrder(null);
    setActiveOrderId(null);
    setSelectedTable(null);
    setCart([]);
    setDiscount(0);
    setNote("");
    setShowInvoice(false);
    setActiveStep(1);
    setSearchTerm("");
    setSelectedCategory("All");
    setIsNewOrder(false);
  };

  const filteredFoods = useMemo(() => {
    return menuItems.filter((food) => {
      const matchCategory =
        selectedCategory === "All" || food.category === selectedCategory;
      const matchSearch =
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (food.description &&
          food.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [menuItems, selectedCategory, searchTerm]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vat = subtotal * 0.1;
  const service = subtotal * 0.05;
  const total = subtotal + vat + service - discount;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const orderReady = Boolean(selectedTable) && cart.length > 0;

  const handlePayment = async () => {
    setShowInvoice(false);
    const orderIdToClose = activeOrderId || selectedOrder?.id;

    if (!orderIdToClose) {
      alert("Vui lòng bấm 'Xác nhận gọi món' trước khi thanh toán.");
      return;
    }

    const shouldStartNewOrder = window.confirm(
      "Thanh toán thành công!\nNhấn OK để tạo đơn mới (chọn bàn lại).\nNhấn Cancel để tiếp tục chọn món cho bàn hiện tại."
    );

    // After payment, update table back to Available
    try {
      await updateOrder(orderIdToClose, {
        status: "DONE",
        diningTableId: null,
        totalAmount: Math.round(total),
      });

      await createInvoiceForOrder(orderIdToClose, {
        date: new Date().toISOString(),
      });

      if (selectedTable) {
        await updateTable(selectedTable.id, {
          status: "Available",
          clearOrder: true,
        });
      }

      await loadData(page, ordersPage);
      setSelectedOrder((prev) => (prev ? { ...prev, status: "DONE" } : prev));
    } catch (e) {
      const errorMessage =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Có lỗi khi cập nhật trạng thái thanh toán.";

      if (String(errorMessage).toLowerCase().includes("already has an invoice")) {
        try {
          await updateOrder(orderIdToClose, {
            status: "DONE",
            diningTableId: null,
            totalAmount: Math.round(total),
          });

          if (selectedTable) {
            await updateTable(selectedTable.id, {
              status: "Available",
              clearOrder: true,
            });
          }

          await loadData(page, ordersPage);
          setSelectedOrder((prev) => (prev ? { ...prev, status: "DONE" } : prev));
        } catch (orderUpdateError) {
          console.error("Lỗi khi cập nhật trạng thái đơn hàng:", orderUpdateError);
          alert("Invoice đã tồn tại nhưng không thể cập nhật trạng thái đơn hàng.");
          return;
        }
      } else {
      console.error("Lỗi khi xác nhận thanh toán:", e);
      alert(`Thanh toán thất bại: ${errorMessage}`);
      return;
      }
    }

    if (shouldStartNewOrder) {
      handleCreateNewOrder();
      return;
    }

    setCart([]);
    setDiscount(0);
    setNote("");
    setActiveStep(3);
  };

  const handleConfirmOrder = async () => {
    if (!selectedTable) {
      alert("Vui lòng chọn bàn trước khi xác nhận");
      return;
    }

    if (cart.length === 0) {
      alert("Vui lòng chọn món trước khi xác nhận");
      return;
    }

    try {
      let orderId = selectedOrder?.id;
      let existingDetails = selectedOrder?.orderDetails || [];

      if (!orderId) {
        const createRes = await createOrder({ diningTableId: selectedTable.id });
        if (createRes?.status === 200 || createRes?.status === 201) {
          orderId = createRes.data.result.id;
          existingDetails = createRes.data.result.orderDetails || [];
        }
      }

      if (!orderId) {
        throw new Error("Cannot resolve order id");
      }

      setActiveOrderId(orderId);

      if (selectedOrder?.id) {
        await updateOrder(orderId, {
          status: "PENDING",
          diningTableId: selectedTable.id,
        });
      }

      const latestOrderRes = await getOrderById(orderId);
      if (latestOrderRes?.status === 200) {
        existingDetails = latestOrderRes.data.result?.orderDetails || [];
      }

      const existingByFoodId = new Map(
        existingDetails
          .filter((detail) => detail?.food?.id)
          .map((detail) => [detail.food.id, detail])
      );

      const cartByFoodId = new Map(cart.map((item) => [item.id, item]));

      const syncTasks = [];

      for (const [foodId, cartItem] of cartByFoodId.entries()) {
        const existingDetail = existingByFoodId.get(foodId);
        if (existingDetail && existingDetail.id != null) {
          if (existingDetail.quantity !== cartItem.qty) {
            syncTasks.push(
              updateOrderDetail(orderId, existingDetail.id, foodId, cartItem.qty)
            );
          }
        } else {
          syncTasks.push(addOrderDetail(orderId, foodId, cartItem.qty));
        }
      }

      for (const [foodId, existingDetail] of existingByFoodId.entries()) {
        if (!cartByFoodId.has(foodId) && existingDetail?.id != null) {
          syncTasks.push(removeOrderDetail(orderId, existingDetail.id));
        }
      }

      await Promise.all(syncTasks);

      const confirmedRes = await getOrderById(orderId);
      if (confirmedRes?.status === 200) {
        setSelectedOrder(confirmedRes.data.result);
        setActiveOrderId(confirmedRes.data.result?.id || orderId);
      }

      await updateTable(selectedTable.id, { status: "Order" });

      alert("Đã xác nhận gọi món thành công và gán bàn!");
      setIsNewOrder(false);
      await loadData(page, ordersPage);
    } catch (error) {
      console.error("Lỗi khi xác nhận gọi món:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Có lỗi xảy ra khi xác nhận gọi món.");
    }
  };

  return (
    <div className="orders-workspace">


      <div className="orders-grid step-layout">

        <div className="orders-stage">
          {activeStep === 1 && (
            <OrdersListStep
              orders={orders}
              onSelectOrder={handleSelectOrder}
              onCreateNewOrder={handleCreateNewOrder}
              onDeleteOrder={handleDeleteOrder}
              formatCurrency={formatCurrency}
              page={ordersPage}
              totalPages={ordersTotalPages}
              onPageChange={(newPage) => loadData(page, newPage)}
            />
          )}

          {activeStep === 2 && (
            <OrdersTableStep
              tables={tables}
              onSelectTable={handleSelectTable}
              selectedTable={selectedTable}
              statusTone={statusTone}
            />
          )}

          {activeStep === 3 && (
            <OrdersMenuPanel
              selectedTable={selectedTable}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              foods={filteredFoods}
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) => loadData(newPage)}
              onAddFood={addFood}
              onBackToTables={() => {
                if (isNewOrder) setActiveStep(2);
                else setActiveStep(1);
              }}
              onContinueToCheckout={() => setActiveStep(4)}
              canContinue={cart.length > 0}
              formatCurrency={formatCurrency}
                allowBackToTableStep={isNewOrder}
            />
          )}

          {activeStep === 4 && (
            <OrdersSummary
              selectedTable={selectedTable}
              cart={cart}
              note={note}
              onNoteChange={setNote}
              discount={discount}
              onDiscountChange={setDiscount}
              quickDiscounts={quickDiscounts}
              subtotal={subtotal}
              vat={vat}
              service={service}
              total={total}
              orderReady={orderReady}
              onDecrease={decrease}
              onAddFood={addFood}
              onBackToMenu={() => setActiveStep(3)}
              onChooseMore={() => setActiveStep(3)}
              onConfirmOrder={handleConfirmOrder}
              onPreviewInvoice={() => setShowInvoice(true)}
              onConfirmPayment={handlePayment}
              formatCurrency={formatCurrency}
            />
          )}
        </div>
      </div>

      {showInvoice && (
        <OrderInvoiceModal
          selectedTable={selectedTable}
          cart={cart}
          note={note}
          subtotal={subtotal}
          vat={vat}
          service={service}
          discount={discount}
          total={total}
          formatCurrency={formatCurrency}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}