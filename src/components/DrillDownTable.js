import React, { useState } from "react";
import { useRole } from "./RoleContext";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles.css";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 
const DrillDownTable = ({ childrenData, level, appliedProduct, appliedMetric }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // 👇 Metric passed via URL (from Performance.js)
  const rootMetric = queryParams.get("metric");

  const [expandedRows, setExpandedRows] = useState({});
  const [overlay, setOverlay] = useState({
    open: false,
    loading: false,
    table2: null,
    territory: null,
  });

  const { setUserRole, setName } = useRole();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState("");
  const [localAppliedProduct, setLocalAppliedProduct] = useState(appliedProduct || "");

  // 👇 Only root level manages metric
  const [selectedMetric, setSelectedMetric] = useState(rootMetric || "Sales");

  const toggleRow = (name) =>
    setExpandedRows((p) => ({ ...p, [name]: !p[name] }));

  const openProfile = (empName, role, territory) => {
    NProgress.start();
    setName(empName);
    setUserRole(role);
    localStorage.setItem("territory", territory);
    navigate(`/profile/${empName}/Review`);
    NProgress.done()
  };

  const styles = {
    th: { backgroundColor: "#eeeeee", padding: "8px 12px", textAlign: "left" },
    td: {
      padding: "8px 12px",
      border: "1px solid black",
      verticalAlign: "top",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
      fontSize: "13px",
    },
    row: { cursor: "pointer" },
    empClickable: { cursor: "pointer" },
    questionMark: {
      marginLeft: 6,
      color: "black",
      cursor: "pointer",
      fontWeight: "bold",
    },
    overlayBg: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    },
    overlayContent: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 8,
      width: "90%",
      maxHeight: "85%",
      overflow: "auto",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    },
    overlayHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    closeBtn: { cursor: "pointer", fontSize: 20, color: "#555" },
    subtle: { margin: 0, color: "#666", fontWeight: 400, fontSize: 12 },
  };

  const openPivotOverlay = async (territory) => {
    setOverlay((o) => ({ ...o, open: true, loading: true, territory }));
    try {
      const res = await fetch(`http://localhost:8000/getTable2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ territory }),
      });
      const data = await res.json();
      setOverlay((o) => ({
        ...o,
        loading: false,
        table2: data?.results || [],
      }));
    } catch (e) {
      console.error("openPivotOverlay error", e);
      setOverlay((o) => ({ ...o, loading: false, table2: [] }));
    }
  };

  const getStockistColumns = (rows) => {
    const cols = new Set();
    (rows || []).forEach((r) => {
      Object.keys(r || {}).forEach((k) => {
        if (k !== "ProductName" && k !== "GrandTotal") cols.add(k);
      });
    });
    return Array.from(cols).sort();
  };

  const collectProducts = (node) => {
    let products = new Set();
    if (node.salesByProduct) {
      Object.keys(node.salesByProduct).forEach((p) => products.add(p));
    }
    if (node.children) {
      Object.values(node.children).forEach((child) => {
        collectProducts(child).forEach((p) => products.add(p));
      });
    }
    return products;
  };

  const allProducts =
    level === 1
      ? Array.from(
          Object.values(childrenData).reduce((acc, child) => {
            collectProducts(child).forEach((p) => acc.add(p));
            return acc;
          }, new Set())
        ).sort()
      : [];

  // 👇 Root controls applied metric + product
  const activeProduct = level === 1 ? localAppliedProduct : appliedProduct;
  const activeMetric = level === 1 ? selectedMetric : appliedMetric;

  return (
    <>
      {level === 1 && (
        <div style={{ marginBottom: "10px" }}>
          {/* ✅ Product Filter only shown for Sales */}
          {selectedMetric === "Sales" && (
            <>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">-- All Products --</option>
                {allProducts.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <button
                style={{ marginLeft: "8px" }}
                onClick={() => setLocalAppliedProduct(selectedProduct)}
              >
                Filter
              </button>
            </>
          )}

          {/* Metric Selector */}
          <select
            style={{ marginLeft: "20px" }}
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="Coverage">Coverage</option>
            <option value="Compliance">Compliance</option>
            <option value="Calls">Calls</option>
            <option value="Chemist_Calls">Chemist Calls</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name (Level {level})</th>
            <th style={styles.th}>Territory</th>
            <th style={styles.th}>{activeMetric}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(childrenData).map(([empCode, child]) => {
            const isLeaf =
              !child.children || Object.keys(child.children).length === 0;

            const salesToShow = activeProduct
              ? child.salesByProduct?.[activeProduct] || 0
              : child.totalSales;

            let metricValue =
              activeMetric === "Sales"
                ? Math.floor(salesToShow)
                : child[activeMetric] ?? "-";

            return (
              <React.Fragment key={empCode}>
                <tr
                  style={{
                    ...styles.row,
                    backgroundColor:
                      child.Coverage <= 50 ? "rgb(255, 120, 120)" : "transparent",
                  }}
                  onClick={() => toggleRow(empCode)}
                >
                  <td style={styles.td}>
                    {level === 1 ? (
                      child.empName
                    ) : (
                      <span
                        style={styles.empClickable}
                        onClick={(e) => {
                          e.stopPropagation();
                          openProfile(child.empName, child.role, child.territory);
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.textDecoration = "none")
                        }
                      >
                        {child.empName}
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>{child.territory}</td>
                  <td style={styles.td}>
                    {metricValue}
                    {activeMetric === "Sales" && isLeaf && child.territory && (
                      <span
                        title="Show Pivot Table"
                        style={styles.questionMark}
                        onClick={(e) => {
                          e.stopPropagation();
                          openPivotOverlay(child.territory);
                        }}
                      >
                        ?
                      </span>
                    )}
                  </td>
                </tr>

                {/* Nested drilldown */}
                {expandedRows[empCode] &&
                  child.children &&
                  Object.keys(child.children).length > 0 && (
                    <tr className="nested">
                      <td colSpan="3" style={{ paddingLeft: 30 }}>
                        <DrillDownTable
                          childrenData={child.children}
                          level={level + 1}
                          appliedProduct={activeProduct}
                          appliedMetric={activeMetric}
                        />
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Pivot overlay */}
      {overlay.open && (
        <div style={styles.overlayBg}>
          <div style={styles.overlayContent}>
            <div style={styles.overlayHeader}>
              <div>
                <h3 style={{ margin: 0 }}>
                  Pivot Table — {overlay.territory || ""}
                </h3>
                <p style={styles.subtle}>
                  Format: <strong>Product Name × Stockists + Grand Total</strong>
                </p>
              </div>
              <span
                style={styles.closeBtn}
                onClick={() =>
                  setOverlay({
                    open: false,
                    loading: false,
                    table2: null,
                    territory: null,
                  })
                }
              >
                ×
              </span>
            </div>

            {overlay.loading ? (
              <div>Loading…</div>
            ) : !Array.isArray(overlay.table2) ||
              overlay.table2.length === 0 ? (
              <div>No data available.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Brand Name</th>
                      {getStockistColumns(overlay.table2).map((s) => (
                        <th key={s} style={styles.th}>
                          {s}
                        </th>
                      ))}
                      <th style={styles.th}>Grand Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...overlay.table2]
                      .sort(
                        (a, b) =>
                          (Number(b.GrandTotal) || 0) -
                          (Number(a.GrandTotal) || 0)
                      )
                      .map((row, idx) => {
                        const stockCols = getStockistColumns(overlay.table2);
                        return (
                          <tr key={idx}>
                            <td style={styles.td}>{row.ProductName || "-"}</td>
                            {stockCols.map((s) => (
                              <td key={s} style={styles.td}>
                                {Number(row[s] ?? 0).toLocaleString()}
                              </td>
                            ))}
                            <td style={styles.td}>
                              {Number(Math.floor(row.GrandTotal) ?? 0).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DrillDownTable;
