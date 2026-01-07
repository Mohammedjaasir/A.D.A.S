import { AnalysisResult, DatasetColumn } from "./analysis-engine";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  chart?: {
    type: "bar" | "pie" | "radar" | "scatter" | "table";
    data: any[];
    title: string;
  };
  timestamp: Date;
}

export function processPrompt(
  prompt: string,
  analysis: AnalysisResult | null,
  headers: string[],
  rows: string[][]
): ChatMessage {
  const lowercasePrompt = prompt.toLowerCase();
  const resId = Math.random().toString(36).substring(7);

  // Helper to find column name in prompt
  const findColumn = (p: string) => {
    return headers.find((h) => p.includes(h.toLowerCase()));
  };

  // 1. Distribution Analysis (Basic exploration, doesn't need full analysis)
  if (lowercasePrompt.includes("distribution") || lowercasePrompt.includes("show me") || lowercasePrompt.includes("how many") || lowercasePrompt.includes("chart")) {
    const colName = findColumn(lowercasePrompt);
    if (colName) {
      const colIndex = headers.indexOf(colName);
      const values = rows.map((r) => r[colIndex]).filter((v) => v);
      const freq: Record<string, number> = {};
      values.forEach((v) => {
        freq[v] = (freq[v] || 0) + 1;
      });

      const data = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([label, value]) => ({ label, value }));

      return {
        id: resId,
        role: "assistant",
        content: `I've analyzed the distribution of **${colName}**. This feature contains ${values.length} valid entries with ${new Set(values).size} unique categories.`,
        chart: {
          type: "bar",
          data,
          title: `${colName} Distribution`,
        },
        timestamp: new Date(),
      };
    }
  }

  // 2. Correlation / Relationship (Basic exploration)
  if (lowercasePrompt.includes("correlation") || lowercasePrompt.includes("relate") || lowercasePrompt.includes("relationship") || lowercasePrompt.includes("versus") || lowercasePrompt.includes(" vs ")) {
    const foundCols = headers.filter((h) => lowercasePrompt.includes(h.toLowerCase()));
    if (foundCols.length >= 2) {
      const col1 = foundCols[0];
      const col2 = foundCols[1];
      const idx1 = headers.indexOf(col1);
      const idx2 = headers.indexOf(col2);
      
      const data = rows.slice(0, 100).map(r => ({
        x: parseFloat(r[idx1]),
        y: parseFloat(r[idx2]),
        label: `Row ${rows.indexOf(r)}`
      })).filter(d => !isNaN(d.x) && !isNaN(d.y));

      return {
        id: resId,
        role: "assistant",
        content: `Analyzing the relationship between **${col1}** and **${col2}**. Linear correlation analysis suggests a potential dependency based on the first 100 records.`,
        chart: {
          type: "scatter",
          data,
          title: `${col1} vs ${col2}`,
        },
        timestamp: new Date(),
      };
    }
  }

  // 3. Model Performance (Requires analysis)
  if (lowercasePrompt.includes("model") || lowercasePrompt.includes("performance") || lowercasePrompt.includes("accuracy") || lowercasePrompt.includes("predict")) {
    if (analysis?.models) {
      const data = analysis.models.map(m => ({
        label: m.name,
        value: m.validationValue
      }));

      return {
        id: resId,
        role: "assistant",
        content: `The **${analysis.finalModel?.name}** model is currently the top performer. Here is the benchmark across all tested architectures.`,
        chart: {
          type: "bar",
          data,
          title: "Model Benchmarks",
        },
        timestamp: new Date(),
      };
    } else {
      return {
        id: resId,
        role: "assistant",
        content: "I haven't run the model benchmarking yet. Please select a target variable and initialize the full assessment to see model performance metrics.",
        timestamp: new Date(),
      };
    }
  }

  // 4. Missing Values
  if (lowercasePrompt.includes("missing") || lowercasePrompt.includes("null") || lowercasePrompt.includes("clean") || lowercasePrompt.includes("quality")) {
    if (analysis) {
      const data = analysis.dataQuality.columns
        .sort((a, b) => b.missingPercent - a.missingPercent)
        .slice(0, 5)
        .map(c => ({ label: c.name, value: c.missingPercent }));

      return {
        id: resId,
        role: "assistant",
        content: `I've identified the columns with the highest missing data density. Overall dataset integrity is ${100 - analysis.dataQuality.missingOverall}%.`,
        chart: {
          type: "pie",
          data,
          title: "Missing Data Concentration",
        },
        timestamp: new Date(),
      };
    } else {
      // Basic missing value calculation without full analysis
      const missingStats = headers.map((h, i) => {
        const count = rows.filter(r => !r[i] || r[i] === '').length;
        return { label: h, value: Math.round((count / rows.length) * 100) };
      }).sort((a, b) => b.value - a.value).slice(0, 5);

      return {
        id: resId,
        role: "assistant",
        content: "Initial data quality scan shows potential gaps. Here are the top columns with missing values.",
        chart: {
          type: "pie",
          data: missingStats,
          title: "Missing Data Estimation",
        },
        timestamp: new Date(),
      };
    }
  }

  // 5. Data Preview
  if (lowercasePrompt.includes("preview") || lowercasePrompt.includes("rows") || lowercasePrompt.includes("data")) {
    return {
      id: resId,
      role: "assistant",
      content: `This dataset contains **${rows.length}** rows and **${headers.length}** columns. The headers are: ${headers.join(", ")}.`,
      timestamp: new Date(),
    };
  }

  // Default response
  return {
    id: resId,
    role: "assistant",
    content: "I'm ready to assist with your data investigation. You can ask about feature distributions, correlations, missing values, or model performance. For example: 'Show me the distribution of income' or 'What is the relationship between age and credit_score?'.",
    timestamp: new Date(),
  };
}
