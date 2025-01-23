<template>
    <div class="map-container">
      <!-- 地图容器 -->
      <div id="mapView" ref="mapContainer"></div>
  
      <!-- 打印控制面板 -->
      <div class="print-controls">
        <select v-model="selectedPaper">
          <option value="A4">A4</option>
          <option value="A3">A3</option>
        </select>
  
        <select v-model="selectedOrientation">
          <option value="portrait">纵向</option>
          <option value="landscape">横向</option>
        </select>
  
        <button @click="exportImage">导出图片</button>
        <button @click="exportPDF">导出PDF</button>
      </div>
  
      <!-- 隐藏的打印区域 -->
      <div id="printArea" class="print-area">
        <div class="map-wrapper">
          <div id="printMap"></div>
        </div>
        <div class="map-overlay">
          <!-- 自定义覆盖元素（如标题、图例等） -->
          <div class="map-title">我的地图</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import Map from '@arcgis/core/Map'
  import MapView from '@arcgis/core/views/MapView'
  import html2canvas from 'html2canvas'
  import jsPDF from 'jspdf'
  
  // 地图实例
  const mapContainer = ref(null)
  let view = null
  
  // 打印参数
  const selectedPaper = ref('A4')
  const selectedOrientation = ref('portrait')
  const DPI = 300 // 打印分辨率
  
  // 纸张尺寸定义（单位：毫米）
  const paperDimensions = {
    A3: { width: 297, height: 420 },
    A4: { width: 210, height: 297 }
  }
  
  // 毫米转像素换算
  const mmToPixels = (mm) => Math.round((mm * DPI) / 25.4)
  
  // 初始化地图
  onMounted(async () => {
    const map = new Map({
      basemap: 'topo-vector'
    })
  
    view = new MapView({
      container: mapContainer.value,
      map: map,
      center: [116.3974, 39.9093], // 北京坐标
      zoom: 10
    })
  })
  
  // 获取当前打印尺寸
  const getPrintSize = () => {
    const dimensions = paperDimensions[selectedPaper.value]
    const isLandscape = selectedOrientation.value === 'landscape'
    
    return {
      width: mmToPixels(isLandscape ? dimensions.height : dimensions.width),
      height: mmToPixels(isLandscape ? dimensions.width : dimensions.height)
    }
  }
  
  // 执行截图和导出
  const processExport = async (callback) => {
    const { width, height } = getPrintSize()
    
    // 第一步：获取地图截图
    const screenshot = await view.takeScreenshot({
      width: width,
      height: height,
      format: 'png',
      quality: 100
    })
  
    // 第二步：使用html2canvas合成其他元素
    const printArea = document.getElementById('printArea')
    const printMap = printArea.querySelector('#printMap')
    
    // 更新打印预览地图尺寸
    printMap.style.width = `${width}px`
    printMap.style.height = `${height}px`
    
    // 将截图插入打印区域
    const img = new Image()
    img.src = screenshot.dataUrl
    printMap.innerHTML = ''
    printMap.appendChild(img)
  
    // 合成整个打印区域
    const canvas = await html2canvas(printArea, {
      useCORS: true,
      scale: 1,
      logging: false
    })
  
    callback(canvas)
  }
  
  // 导出为图片
  const exportImage = () => {
    processExport((canvas) => {
      const link = document.createElement('a')
      link.download = `map_${selectedPaper.value}_${selectedOrientation.value}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    })
  }
  
  // 导出为PDF
  const exportPDF = () => {
    processExport((canvas) => {
      const { width, height } = getPrintSize()
      const pdf = new jsPDF({
        orientation: selectedOrientation.value,
        unit: 'mm',
        format: selectedPaper.value.toLowerCase()
      })
  
      const imgData = canvas.toDataURL('image/png')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`map_${selectedPaper.value}_${selectedOrientation.value}.pdf`)
    })
  }
  </script>
  
  <style scoped>
  .map-container {
    position: relative;
    width: 100%;
    height: 100vh;
  }
  
  #printView {
    width: 100%;
    height: 100%;
  }
  
  .print-controls {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 100;
    background: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .print-area {
    position: absolute;
    left: -9999px;
    width: 100%;
    background: white;
  }
  
  .map-wrapper {
    position: relative;
  }
  
  .map-overlay {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  
  .map-title {
    font-size: 24px;
    font-weight: bold;
    padding: 10px;
    background: rgba(255,255,255,0.8);
  }
  </style>