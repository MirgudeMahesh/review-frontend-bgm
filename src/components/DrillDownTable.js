import React, { useState, useEffect } from "react";
import { useRole } from "./RoleContext";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles.css";
import useEncodedTerritory from "./hooks/useEncodedTerritory";

const DrillDownTable = ({ childrenData, level, appliedMetric, maxDepth: maxDepthProp }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { decoded, encoded } = useEncodedTerritory();
  const rootMetric = queryParams.get("metric");

  const [expandedRows, setExpandedRows] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [division, setDivision] = useState(null);
  const [loadingDivision, setLoadingDivision] = useState(false);
  const [divisionError, setDivisionError] = useState(null);

  const { setUser, setUserRole } = useRole();
  const navigate = useNavigate();

  const [selectedMetric, setSelectedMetric] = useState(rootMetric || "Coverage");

  // root stores maxDepth in state, children receive via prop
  const [maxDepthState, setMaxDepthState] = useState(null);
  const maxDepth = maxDepthProp ?? maxDepthState;

  // ---------- compute GLOBAL max depth once at root ----------
  useEffect(() => {
    if (level !== 1) return;

    const computeDepth = (node, currentLevel) => {
      if (!node || !node.children || Object.keys(node.children).length === 0) {
        return currentLevel;
      }
      let max = currentLevel;
      Object.values(node.children).forEach((child) => {
        max = Math.max(max, computeDepth(child, currentLevel + 1));
      });
      return max;
    };

    let depth = 1;
    Object.values(childrenData || {}).forEach((child) => {
      depth = Math.max(depth, computeDepth(child, 1));
    });
    setMaxDepthState(depth);
  }, [childrenData, level]);

  // Fetch division
  useEffect(() => {
    const fetchDivision = async () => {
      if (!decoded) return;

      try {
        setLoadingDivision(true);
        setDivisionError(null);

        const response = await fetch(
          `https://review-backend-bgm.onrender.com/getdivision?territory=${encodeURIComponent(decoded)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setDivision(data.division);
      } catch (error) {
        console.error("Error fetching division:", error);
        setDivisionError(error.message);
        setDivision(null);
      } finally {
        setLoadingDivision(false);
      }
    };

    fetchDivision();
  }, [decoded]);

  const getAllowedMetrics = () => {
    const baseMetrics = [
      { value: "Coverage", label: "Coverage" },
      { value: "Compliance", label: "Compliance" },
      { value: "Calls", label: "Calls" },
      { value: "Chemist_Calls", label: "Chemists Met" },
    ];

    if (!division) return baseMetrics;

    const divisionUpper = division.toUpperCase();

    if (["NUCLEUS", "MAXIMUS", "IMPETUS", "STIMULUS"].includes(divisionUpper)) {
      return [
        ...baseMetrics,
        { value: "Deksel_Midmonth_Qty", label: "Deksel Midmonth Qty" },
      ];
    }

    if (divisionUpper === "GLADIUS") {
      return [
        ...baseMetrics,
        { value: "Voltaneuron_Midmonth_Qty", label: "Voltaneuron Midmonth Qty" },
        { value: "Proaxen_Midmonth_Qty", label: "Proaxen Midmonth Qty" },
      ];
    }

    if (divisionUpper === "GLAMUS") {
      return [
        ...baseMetrics,
        { value: "Deksel_Midmonth_Qty", label: "Deksel Midmonth Qty" },
        { value: "Voltaneuron_Midmonth_Qty", label: "Voltaneuron Midmonth Qty" },
        { value: "Proaxen_Midmonth_Qty", label: "Proaxen Midmonth Qty" },
      ];
    }

    return baseMetrics;
  };

  const toggleRow = (code) =>
    setExpandedRows((p) => ({ ...p, [code]: !p[code] }));

  const openProfile = (empName, role, territory) => {
    setUser(empName);
    
    if (['BE', 'TE', 'KAE', 'NE'].includes(role)) {
      setUserRole('BE');
    } else {
      setUserRole(role);
    }
    
    navigate(`/profile/${empName}/Review?ec=${encoded}&pec=${btoa(territory)}`);
  };

  const startEditing = (territory, metricType, currentValue) => {
    setEditingCell(`${territory}_${metricType}`);
    setEditValue(currentValue || "0");
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const saveProductQty = async (territory, metricType) => {
    try {
      const value = parseFloat(editValue);

      if (isNaN(value)) {
        alert("Please enter a valid number");
        return;
      }

      setSaving(true);

      const columnMap = {
        Deksel_Midmonth_Qty: "deksel_midmonth_qty",
        Voltaneuron_Midmonth_Qty: "voltaneuron_midmonth_qty",
        Proaxen_Midmonth_Qty: "proaxen_midmonth_qty",
      };

      const response = await fetch("https://review-backend-bgm.onrender.com/updateProductQty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          territory: territory.trim(),
          metric_type: columnMap[metricType],
          value: value,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update product quantity");
      }

      try {
        const logResponse = await fetch("https://review-backend-bgm.onrender.com/midmonth-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender_territory: decoded,
            receiver_territory: territory.trim(),
            Metric: metricType,
            Value: value,
          }),
        });

        const logResult = await logResponse.json();
        if (!logResponse.ok) {
          console.error("Failed to log update:", logResult.error);
        }
      } catch (logError) {
        console.error("Error logging update:", logError);
      }

      setEditingCell(null);
      setEditValue("");

      if (result.alreadyUpToDate) {
        alert("Value is already up to date!");
      } else {
        alert(
          `${metricType.replace(/_/g, " ")} updated successfully! (${result.affectedRows} row(s) affected)`
        );
      }

      window.location.reload();
    } catch (error) {
      console.error("Error saving product quantity:", error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const activeMetric = level === 1 ? selectedMetric : appliedMetric;
  const allowedMetrics = getAllowedMetrics();

  const isProductQtyMetric = (metric) =>
    ["Deksel_Midmonth_Qty", "Voltaneuron_Midmonth_Qty", "Proaxen_Midmonth_Qty"].includes(metric);

  // ---------- SIMPLIFIED: Leaf OR BM territory clickable ----------
  const isBM = (territory) => {
    if (!territory || typeof territory !== 'string') return false;
    return territory.toUpperCase().endsWith('BM');
  };

  const shouldOpenProfile = (isLeaf, territory) => 
    (isLeaf || isBM(territory)) && level !== 1;

  return (
    <div className="drilldown-table-container">
      {level === 1 && (
        <div className="drilldown-metric-selector">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            {allowedMetrics.map((metric) => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <table className="drilldown-table">
        <thead>
          <tr>
            <th>Name (Level {level})</th>
            <th>Territory</th>
            <th>{activeMetric.replace(/_/g, " ")}</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(childrenData).map(([key, child]) => {
            const hasChildren =
              child.children && Object.keys(child.children).length > 0;
            const isLeaf = !hasChildren;

            const metricValue =
              child[activeMetric] !== undefined ? child[activeMetric] : "-";

            const isEditing =
              editingCell === `${child.territory}_${activeMetric}`;
            const canEdit = isLeaf && isProductQtyMetric(activeMetric);

            // ---------- NEW SIMPLE LOGIC: Leaf OR BM territory ----------
            const profileClickable = shouldOpenProfile(isLeaf, child.territory);

            const rowClass = hasChildren
              ? expandedRows[key]
                ? "expandable-row expanded-row"
                : "expandable-row"
              : "leaf-row";

            return (
              <React.Fragment key={key}>
                <tr
                  className={rowClass}
                  onClick={() => toggleRow(key)}
                >
                  <td className="name-cell">
                    {profileClickable ? (
                      <span
                        className="name-cell clickable"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProfile(
                            child.empName,
                            child.role,
                            child.territory
                          );
                        }}
                      >
                        {child.empName}
                      </span>
                    ) : (
                      child.empName
                    )}
                  </td>

                  <td className="territory-cell">{child.territory}</td>

                  <td
                    className={`metric-cell ${saving ? "saving" : ""}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isEditing ? (
                      <div className="editable-cell">
                        <input
                          type="number"
                          step="0.01"
                          className="edit-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                          disabled={saving}
                        />
                        <button
                          className="save-button"
                          onClick={() =>
                            saveProductQty(child.territory, activeMetric)
                          }
                          disabled={saving}
                        >
                          {saving ? "..." : "Save"}
                        </button>
                        <button
                          className="cancel-button"
                          onClick={cancelEditing}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="editable-cell">
                        <span>{metricValue}</span>
                        {canEdit && (
                          <button
                            className="edit-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(
                                child.territory,
                                activeMetric,
                                metricValue
                              );
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>

                {expandedRows[key] && hasChildren && (
                  <tr>
                    <td colSpan="3" className="nested-table-wrapper">
                      <DrillDownTable
                        childrenData={child.children}
                        level={level + 1}
                        appliedMetric={activeMetric}
                        maxDepth={maxDepth}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DrillDownTable;
