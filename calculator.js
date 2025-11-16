// 风险计算函数
function calculateRisk() {
    // 获取输入值
    var inputs = getInputValues();
    
    // 验证输入
    if (!validateInputs(inputs)) {
        return;
    }
    
    // 计算风险概率
    var riskProbability = calculateRiskProbability(inputs);
    
    // 显示结果
    displayResults(riskProbability, inputs);
}

// 获取输入值
function getInputValues() {
    var shock_index = parseFloat(document.getElementById('shock_index').value) || 0;
    var timi = parseInt(document.getElementById('timi').value) || 0;
    var culprit_vessel = parseInt(document.getElementById('culprit_vessel').value) || 0;
    
    return {
        shock_index: shock_index,
        timi: timi,
        culprit_vessel: culprit_vessel
    };
}

// 验证输入
function validateInputs(inputs) {
    // 验证休克指数
    if (!inputs.shock_index && inputs.shock_index !== 0) {
        alert('请输入休克指数');
        document.getElementById('shock_index').focus();
        return false;
    }
    
    if (inputs.shock_index < 0 || inputs.shock_index > 2) {
        alert('休克指数应在0-2之间');
        document.getElementById('shock_index').focus();
        return false;
    }
    
    // 验证TIMI评分
    if (!inputs.timi && inputs.timi !== 0) {
        alert('请输入TIMI评分');
        document.getElementById('timi').focus();
        return false;
    }
    
    if (inputs.timi < 0 || inputs.timi > 14) {
        alert('TIMI评分应在0-14之间');
        document.getElementById('timi').focus();
        return false;
    }
    
    return true;
}

// 根据回归方程计算风险概率
function calculateRiskProbability(inputs) {
    // 回归方程: P = 1 / [1 + exp(-( -3.05583 + 4.47048 × Shock_Index + 0.433743 × TIMI - 1.64256 × Culprit_Vessel_2))]
    
    // Culprit_Vessel_2: 前降支(LAD)=0, 其他血管=1
    var culprit_vessel_2 = inputs.culprit_vessel;
    
    // 计算线性组合
    var linearCombination = -3.05583 + 
                           (4.47048 * inputs.shock_index) + 
                           (0.433743 * inputs.timi) - 
                           (1.64256 * culprit_vessel_2);
    
    // 计算概率
    var probability = 1 / (1 + Math.exp(-linearCombination));
    
    return probability;
}

// 显示结果
function displayResults(probability, inputs) {
    var percentage = (probability * 100).toFixed(1);
    var resultSection = document.getElementById('resultSection');
    var riskPercentage = document.getElementById('riskPercentage');
    var riskCategory = document.getElementById('riskCategory');
    var riskBar = document.getElementById('riskBar');
    var riskInterpretation = document.getElementById('riskInterpretation');
    var riskFactors = document.getElementById('riskFactors');
    
    // 更新风险百分比
    riskPercentage.innerHTML = percentage + '%';
    
    // 确定风险等级和颜色
    var riskLevel, riskClass, interpretation, barColor;
    if (probability < 0.3) {
        riskLevel = "低风险";
        riskClass = "risk-low";
        interpretation = "基于模型预测，患者发生MIRI的风险较低。建议常规监测和标准治疗。";
        barColor = "#27ae60";
    } else if (probability < 0.7) {
        riskLevel = "中风险";
        riskClass = "risk-medium";
        interpretation = "基于模型预测，患者发生MIRI的风险中等。建议加强监测并考虑预防性治疗。";
        barColor = "#f39c12";
    } else {
        riskLevel = "高风险";
        riskClass = "risk-high";
        interpretation = "基于模型预测，患者发生MIRI的风险较高。需要积极干预和密切监测。";
        barColor = "#e74c3c";
    }
    
    // 更新风险等级
    riskCategory.innerHTML = riskLevel;
    riskCategory.className = "risk-level " + riskClass;
    
    // 更新进度条
    riskBar.style.width = percentage + '%';
    riskBar.style.background = barColor;
    
    // 更新解读
    riskInterpretation.innerHTML = interpretation;
    
    // 生成风险因素分析
    generateRiskFactors(inputs, probability, riskFactors);
    
    // 显示结果区域
    resultSection.style.display = 'block';
}

// 生成风险因素分析
function generateRiskFactors(inputs, probability, container) {
    var factorsHTML = '';
    
    // 休克指数分析
    var shockRisk = '';
    var shockColor = '#27ae60';
    if (inputs.shock_index < 0.5) {
        shockRisk = '偏低';
    } else if (inputs.shock_index <= 0.7) {
        shockRisk = '正常';
    } else if (inputs.shock_index <= 0.9) {
        shockRisk = '偏高';
        shockColor = '#f39c12';
    } else {
        shockRisk = '显著升高';
        shockColor = '#e74c3c';
    }
    
    factorsHTML += '<div class="factor-item">';
    factorsHTML += '<span>休克指数</span>';
    factorsHTML += '<span style="color: ' + shockColor + ';">' + inputs.shock_index + ' (' + shockRisk + ')</span>';
    factorsHTML += '</div>';
    
    // TIMI评分分析
    var timiRisk = '';
    var timiColor = '#27ae60';
    if (inputs.timi <= 3) {
        timiRisk = '低危';
    } else if (inputs.timi <= 6) {
        timiRisk = '中危';
        timiColor = '#f39c12';
    } else {
        timiRisk = '高危';
        timiColor = '#e74c3c';
    }
    
    factorsHTML += '<div class="factor-item">';
    factorsHTML += '<span>TIMI评分</span>';
    factorsHTML += '<span style="color: ' + timiColor + ';">' + inputs.timi + '分 (' + timiRisk + ')</span>';
    factorsHTML += '</div>';
    
    // 罪犯血管分析
    var vesselName = '';
    var vesselRisk = '';
    var vesselColor = '#27ae60';
    
    if (inputs.culprit_vessel === 0) {
        vesselName = '前降支 (LAD)';
        vesselRisk = '高风险血管';
        vesselColor = '#e74c3c';
    } else {
        vesselName = '非前降支血管';
        vesselRisk = '中等风险血管';
        vesselColor = '#f39c12';
    }
    
    factorsHTML += '<div class="factor-item">';
    factorsHTML += '<span>罪犯血管</span>';
    factorsHTML += '<span style="color: ' + vesselColor + ';">' + vesselName + ' (' + vesselRisk + ')</span>';
    factorsHTML += '</div>';
    
    container.innerHTML = factorsHTML;
}

// 重置表单
function resetForm() {
    document.getElementById('riskForm').reset();
    document.getElementById('resultSection').style.display = 'none';
}

// 页面加载完成后添加事件监听
window.onload = function() {
    // 实时验证TIMI评分范围
    document.getElementById('timi').oninput = function() {
        var value = parseInt(this.value);
        if (value < 0) this.value = 0;
        if (value > 14) this.value = 14;
    };
    
    // 实时验证休克指数
    document.getElementById('shock_index').oninput = function() {
        var value = parseFloat(this.value);
        if (value < 0) this.value = 0;
        if (value > 2) this.value = 2;
    };
};