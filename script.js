// Khởi tạo CodeMirror
const codeEditor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
    mode: 'python',
    theme: 'monokai',
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    lineWrapping: true
});

// Mảng chứa mã Python mẫu cho mỗi cấp độ
const sampleCodes = [
    // Cấp độ 1 - Mẫu ban đầu
    `import math
def color(x, y, z):
    if x == 0 and y == 0 and z == 2:
        return RED
    
    if abs(x) == 2 or abs(y) == 2 or z == -2:
        return GREEN
    
    return WHITE`,
    
    // Cấp độ 2 - Mẫu chữ thập
    `import math
def color(x, y, z):
    if x == 0 or y == 0:
        return BLUE
    else:
        return WHITE`,
    
    // Cấp độ 3 - Mẫu bàn cờ
    `import math
def color(x, y, z):
    if (x + y + z) % 2 == 0:
        return BLACK
    else:
        return WHITE`,
    
    // Cấp độ 4 - Mẫu hình học phức tạp
    `import math
def color(x, y, z):
    # Các góc khối lập phương
    if abs(x) == 2 and abs(y) == 2 and abs(z) == 2:
        return RED
    
    # Các cạnh của khối lập phương
    if (abs(x) == 2 and abs(y) == 2) or (abs(x) == 2 and abs(z) == 2) or (abs(y) == 2 and abs(z) == 2):
        return ORANGE
    
    # Mặt trên và dưới - mẫu đặc biệt
    if z == 2 or z == -2:
        # Tạo mẫu hình xoắn ốc trên mặt trên và dưới
        if (x + y) % 2 == 0:
            return PURPLE
        else:
            return CYAN
    
    # Mặt trước và sau - mẫu đặc biệt
    if y == 2 or y == -2:
        # Tạo mẫu hình chéo
        if x * z > 0:
            return GREEN
        else:
            return YELLOW
    
    # Mặt trái và phải - mẫu đặc biệt
    if x == 2 or x == -2:
        # Tạo mẫu hình ô vuông
        if abs(y) == abs(z):
            return BLUE
        else:
            return PINK
    
    # Trường hợp còn lại (không nên xảy ra vì chúng ta chỉ tạo vỏ ngoài)
    return BLACK`,
    
    // Cấp độ 5 - Mẫu xoắn ốc
    `import math
def color(x, y, z):
    if x == y or x == -y:
        return PURPLE
    elif z == 2 or z == -2:
        return CYAN
    else:
        return WHITE`,
    
    // Cấp độ 6 - Mẫu cầu vồng
    `import math
def color(x, y, z):
    if z == 2:
        if y == 2: return RED
        if y == 1: return ORANGE
        if y == 0: return YELLOW
        if y == -1: return GREEN
        if y == -2: return BLUE
    return WHITE`,
    
    // Cấp độ 7 - Mẫu kim tự tháp màu sắc
    `import math
def color(x, y, z):
    # Các góc khối lập phương
    if abs(x) == 2 and abs(y) == 2 and abs(z) == 2:
        return RED
    
    # Tạo hiệu ứng kim tự tháp với các lớp màu
    sum_abs = abs(x) + abs(y) + abs(z)
    
    # Mặt trên - kim tự tháp
    if z == 2:
        if sum_abs <= 4: return YELLOW
        return ORANGE
    
    # Mặt dưới - kim tự tháp ngược
    if z == -2:
        if sum_abs <= 4: return CYAN
        return BLUE
    
    # Mặt trước và sau - mẫu xoáy
    if y == 2 or y == -2:
        if (x + z) % 2 == 0: return GREEN
        return PURPLE
    
    # Mặt trái và phải - mẫu đối xứng
    if x == 2 or x == -2:
        if (y * z) > 0: return PINK
        return BLACK
    
    return WHITE`,
    
    // Cấp độ 8 - Mẫu mặt cười
    `import math
def color(x, y, z):
    if z == 2:
        # Mắt
        if (x == -1 and y == 1) or (x == 1 and y == 1):
            return BLACK
        # Miệng cười
        if y == -1 and abs(x) <= 1:
            return BLACK
        if (x == -1 and y == -2) or (x == 1 and y == -2):
            return BLACK
    return YELLOW`,
    
    // Cấp độ 9 - Mẫu hình học phức tạp
    `import math
def color(x, y, z):
    sum_abs = abs(x) + abs(y) + abs(z)
    if sum_abs % 3 == 0:
        return RED
    elif sum_abs % 3 == 1:
        return GREEN
    else:
        return BLUE`,
    
    // Cấp độ 10 - Mẫu xoay chiều
    `import math
def color(x, y, z):
    product = x * y * z
    if product > 0:
        return PURPLE
    elif product < 0:
        return ORANGE
    else:
        return CYAN`,
    
    // Cấp độ 11 - Mẫu phức tạp nhất
    `import math
def color(x, y, z):
    sum_abs = abs(x) + abs(y) + abs(z)
    if sum_abs == 6: return RED
    if sum_abs == 5: return ORANGE
    if sum_abs == 4: return YELLOW
    if sum_abs == 3: return GREEN
    if sum_abs == 2: return BLUE
    if sum_abs == 1: return PURPLE
    return WHITE`
];

// Sửa mã Python ban đầu (loại bỏ 'then' và 'end' không phải cú pháp Python)
codeEditor.setValue('def color(x, y, z):\n    return WHITE');

// Hàm hiển thị gợi ý khi người dùng nhấn nút gợi ý
function hienThiGoiY() {
    const hintOutput = document.getElementById('hintOutput');
    
    // Xóa nội dung cũ nếu có
    while (hintOutput.firstChild) {
        hintOutput.removeChild(hintOutput.firstChild);
    }
    
    // Tạo textarea để người dùng có thể dễ dàng sao chép code
    const textarea = document.createElement('textarea');
    textarea.value = sampleCodes[currentLevel - 1];
    textarea.readOnly = true;
    textarea.className = 'hint-textarea';
    textarea.style.width = '100%';
    textarea.style.height = '150px';
    textarea.style.backgroundColor = '#2c3e50';
    textarea.style.color = '#f39c12';
    textarea.style.border = 'none';
    textarea.style.padding = '10px';
    textarea.style.fontFamily = '"Courier New", monospace';
    textarea.style.fontSize = '14px';
    textarea.style.resize = 'none';
    textarea.style.outline = 'none';
    
    // Tạo container cho nút sao chép
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'hint-button-container';
    
    // Tạo nút sao chép code
    const copyButton = document.createElement('button');
    copyButton.id = 'copyCodeButton';
    copyButton.textContent = 'Sao chép code';
    copyButton.addEventListener('click', saoChepCode);
    
    // Thêm nút vào container
    buttonContainer.appendChild(copyButton);
    
    // Thêm textarea và container nút vào hintOutput
    hintOutput.appendChild(textarea);
    hintOutput.appendChild(buttonContainer);
    hintOutput.style.display = 'block';}


// Biến toàn cục
let pyodide;
let mainScene, mainCamera, mainRenderer, mainControls;
let targetScene, targetCamera, targetRenderer, targetControls;
let mainCubes = [];
let targetCubes = [];
const cubeSize = 1;
const gridSize = 5; // Lưới 5x5x5
const colors = {
    RED: 0xff0000,
    GREEN: 0x00aa44, // Màu xanh lá đẹp mắt hơn
    BLUE: 0x0000ff,
    YELLOW: 0xffff00,
    ORANGE: 0xff8800,
    PURPLE: 0x8800ff,
    CYAN: 0x00ffff,
    PINK: 0xff00ff,
    WHITE: 0xffffff,
    BLACK: 0x000000
};

// Biến theo dõi cấp độ hiện tại
let currentLevel = 1;
let totalLevels = 11; // Cấp độ ban đầu + 10 cấp độ mới

// Khởi tạo Pyodide
async function khoiTaoPyodide() {
    pyodide = await loadPyodide();
    await pyodide.loadPackagesFromImports(`
        import math
    `);
    
    // Định nghĩa hằng số màu sắc trong Python (hỗ trợ cả chữ hoa và chữ thường)
    pyodide.runPython(`
        # Định nghĩa màu với chữ hoa
        RED = "RED"
        GREEN = "GREEN"
        BLUE = "BLUE"
        YELLOW = "YELLOW"
        ORANGE = "ORANGE"
        PURPLE = "PURPLE"
        CYAN = "CYAN"
        PINK = "PINK"
        WHITE = "WHITE"
        BLACK = "BLACK"
        
        # Định nghĩa màu với chữ thường
        red = RED
        green = GREEN
        blue = BLUE
        yellow = YELLOW
        orange = ORANGE
        purple = PURPLE
        cyan = CYAN
        pink = PINK
        white = WHITE
        black = BLACK
        
        def abs(x):
            return math.fabs(x)
    `);
    
    document.getElementById('runButton').disabled = false;
}

// Khởi tạo cảnh 3D
function khoiTaoCanhBa() {
    // Cảnh khối chính
    mainScene = new THREE.Scene();
    mainScene.background = new THREE.Color(0x2c5aa0); // Màu xanh dương đậm giống hình mẫu
    
    mainCamera = new THREE.PerspectiveCamera(75, document.getElementById('cubeContainer').clientWidth / document.getElementById('cubeContainer').clientHeight, 0.1, 1000);
    mainCamera.position.set(5, 4.5, 8); // Điều chỉnh camera gần hơn với khối Rubik
    
    mainRenderer = new THREE.WebGLRenderer({ antialias: true });
    mainRenderer.setSize(document.getElementById('cubeContainer').clientWidth, document.getElementById('cubeContainer').clientHeight);
    document.getElementById('cubeContainer').appendChild(mainRenderer.domElement);
    
    mainControls = new THREE.OrbitControls(mainCamera, mainRenderer.domElement);
    mainControls.enableDamping = true;
    mainControls.dampingFactor = 0.25;
    
    // Xóa lưới trợ giúp và thay thế bằng trục tọa độ với nhãn ở bên ngoài khối Rubik
    // Tạo trục X (màu đỏ) - đặt ở phía dưới khối Rubik
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 4 });
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2, -3, 2.5),
        new THREE.Vector3(2, -3, 2.5)
    ]);
    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    mainScene.add(xAxis);
    
    // Tạo trục Y (màu xanh lá) - đặt ở bên trái khối Rubik
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 4 });
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(3, -2, -2.5),
        new THREE.Vector3(3, 2, -2.5)
    ]);
    const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
    mainScene.add(yAxis);
    
    // Tạo trục Z (màu xanh dương) - đặt ở phía sau khối Rubik
    const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 4 });
    const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(3, -3, -2),
        new THREE.Vector3(3, -3, 2)
    ]);
    const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
    mainScene.add(zAxis);
    
    // Thêm nhãn cho trục X (trục dọc)
    for (let i = -2; i <= 2; i++) {
        const label = createTextLabel(`${i > 0 ? '+' : ''}${i}`, { x: i, y: -3, z: 3}, 0xff0000);
        mainScene.add(label);
    }
    // Thêm nhãn X
    const labelX = createTextLabel("X", { x: 0, y: -3, z: 3.5 }, 0xff0000);
    mainScene.add(labelX);
    
    // Thêm nhãn cho trục Y (trục ngang)
    for (let i = -2; i <= 2; i++) {
        const label = createTextLabel(`${i > 0 ? '+' : ''}${i}`, { x: 3.5, y: i, z: -2.5 }, 0x00ff00);
        mainScene.add(label);
    }
    // Thêm nhãn Y
    const labelY = createTextLabel("Y", { x: 4, y: 0, z: -2.5 }, 0x00ff00);
    mainScene.add(labelY);
    
    // Thêm nhãn cho trục Z
    for (let i = -2; i <= 2; i++) {
        const label = createTextLabel(`${i > 0 ? '+' : ''}${i}`, { x: 3.5, y: -3, z: i }, 0x0000ff);
        mainScene.add(label);
    }
    // Thêm nhãn Z
    const labelZ = createTextLabel("Z", { x: 4, y: -3, z: 0 }, 0x0000ff);  
    mainScene.add(labelZ);
    
    // Thêm ánh sáng môi trường
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    mainScene.add(ambientLight);
    
    // Thêm ánh sáng định hướng
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    mainScene.add(directionalLight);
    
    // Cảnh khối mục tiêu
    targetScene = new THREE.Scene();
    targetScene.background = new THREE.Color(0xf5f5f5);
    
    // Thêm trục tọa độ cho cảnh mục tiêu ở bên ngoài khối Rubik
    // Tạo trục X (màu đỏ) - đặt ở phía dưới khối Rubik
    const targetXAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 4 });
    const targetXAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2, -3, 2.5),
        new THREE.Vector3(2, -3, 2.5)
    ]);
    const targetXAxis = new THREE.Line(targetXAxisGeometry, targetXAxisMaterial);
    targetScene.add(targetXAxis);
    
    // Tạo trục Y (màu xanh lá) - đặt ở bên trái khối Rubik
    const targetYAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 4 });
    const targetYAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(3, -2, -2.5),
        new THREE.Vector3(3, 2, -2.5)
    ]);
    const targetYAxis = new THREE.Line(targetYAxisGeometry, targetYAxisMaterial);
    targetScene.add(targetYAxis);
    
    // Tạo trục Z (màu xanh dương) - đặt ở phía sau khối Rubik
    const targetZAxisMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 4 });
    const targetZAxisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(3, -3, -2),
        new THREE.Vector3(3, -3, 2)
    ]);
    const targetZAxis = new THREE.Line(targetZAxisGeometry, targetZAxisMaterial);
    targetScene.add(targetZAxis);
    
    // Thêm nhãn cho trục X, Y, Z
    for (let i = -2; i <= 2; i++) {
        const labelX = createTextLabel(`${i > 0 ? '+' : ''}${i}`, { x: i, y: -3, z: 3}, 0xff0000);
        const labelY = createTextLabel(`${i > 0 ? '+' : ''}${i}`, { x: 3.5, y: i, z: -2.5 }, 0x00ff00);
        const labelZ = createTextLabel(`${i > 0 ? '+' : ''}${i}`, { x: 3.5, y: -3, z: i }, 0x0000ff);
        targetScene.add(labelX);
        targetScene.add(labelY);
        targetScene.add(labelZ);
    }
    
    // Thêm nhãn X, Y, Z
    const targetLabelX = createTextLabel("X", { x: 0, y: -3, z: 3.5 }, 0xff0000);
    const targetLabelY = createTextLabel("Y", { x: 4, y: 0, z: -2.5 }, 0x00ff00);
    const targetLabelZ = createTextLabel("Z", { x: 4, y: -3, z: 0 }, 0x0000ff);
    targetScene.add(targetLabelX);
    targetScene.add(targetLabelY);
    targetScene.add(targetLabelZ);
    
    // Thêm nhãn gốc tọa độ
    const targetOriginLabel = createTextLabel("0", { x: -0.3, y: -0.3, z: -0.3 }, 0xffffff);
    targetScene.add(targetOriginLabel);
    
    targetCamera = new THREE.PerspectiveCamera(75, document.getElementById('targetCubeContainer').clientWidth / document.getElementById('targetCubeContainer').clientHeight, 0.1, 1000);
    targetCamera.position.set(4, 3.5, 7); // Điều chỉnh camera gần hơn với khối Rubik
    
    targetRenderer = new THREE.WebGLRenderer({ antialias: true });
    targetRenderer.setSize(document.getElementById('targetCubeContainer').clientWidth, document.getElementById('targetCubeContainer').clientHeight);
    document.getElementById('targetCubeContainer').appendChild(targetRenderer.domElement);
    
    targetControls = new THREE.OrbitControls(targetCamera, targetRenderer.domElement);
    targetControls.enableDamping = true;
    targetControls.dampingFactor = 0.25;
    
    // Thêm ánh sáng môi trường vào cảnh mục tiêu
    const targetAmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
    targetScene.add(targetAmbientLight);
    
    // Thêm ánh sáng định hướng vào cảnh mục tiêu
    const targetDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    targetDirectionalLight.position.set(5, 10, 7);
    targetScene.add(targetDirectionalLight);
    
    // Tạo mẫu mục tiêu (mẫu hiển thị trong hình ảnh)
    taoMauMucTieu();
    
    // Hiển thị ban đầu
    hienThi();
}

// Mảng chứa các mẫu mục tiêu cho các cấp độ khác nhau
const targetPatterns = [
    // Cấp độ 1 - Mẫu ban đầu (khối xanh lá với ô vuông trắng và tâm đỏ)
    function(x, y, z, offset) {
        if (z === offset) {
            if (Math.abs(x) <= 1 && Math.abs(y) <= 1) {
                if (x === 0 && y === 0) {
                    return colors.RED; // Tâm đỏ
                } else {
                    return colors.WHITE; // Ô vuông trắng
                }
            } else {
                return colors.GREEN; // Viền ngoài xanh lá
            }
        } else {
            return colors.GREEN; // Xanh lá cho tất cả các mặt khác
        }
    },
    
    // Cấp độ 2 - Mẫu chữ thập
    function(x, y, z, offset) {
        if (x === 0 || y === 0) {
            return colors.BLUE;
        } else {
            return colors.WHITE;
        }
    },
    
    // Cấp độ 3 - Mẫu bàn cờ
    function(x, y, z, offset) {
        if ((x + y + z) % 2 === 0) {
            return colors.BLACK;
        } else {
            return colors.WHITE;
        }
    },
    
    // Cấp độ 4 - Mẫu hình học phức tạp
    function(x, y, z, offset) {
        // Tạo mẫu phức tạp với nhiều điều kiện và màu sắc
        // Các góc khối lập phương
        if (Math.abs(x) === 2 && Math.abs(y) === 2 && Math.abs(z) === 2) {
            return colors.RED;
        }
        
        // Các cạnh của khối lập phương
        if ((Math.abs(x) === 2 && Math.abs(y) === 2) || 
            (Math.abs(x) === 2 && Math.abs(z) === 2) || 
            (Math.abs(y) === 2 && Math.abs(z) === 2)) {
            return colors.ORANGE;
        }
        
        // Mặt trên và dưới - mẫu đặc biệt
        if (z === 2 || z === -2) {
            // Tạo mẫu hình xoắn ốc trên mặt trên và dưới
            if ((x + y) % 2 === 0) {
                return colors.PURPLE;
            } else {
                return colors.CYAN;
            }
        }
        
        // Mặt trước và sau - mẫu đặc biệt
        if (y === 2 || y === -2) {
            // Tạo mẫu hình chéo
            if (x * z > 0) {
                return colors.GREEN;
            } else {
                return colors.YELLOW;
            }
        }
        
        // Mặt trái và phải - mẫu đặc biệt
        if (x === 2 || x === -2) {
            // Tạo mẫu hình ô vuông
            if (Math.abs(y) === Math.abs(z)) {
                return colors.BLUE;
            } else {
                return colors.PINK;
            }
        }
        
        // Trường hợp còn lại (không nên xảy ra vì chúng ta chỉ tạo vỏ ngoài)
        return colors.BLACK;
    },
    
    // Cấp độ 5 - Mẫu xoắn ốc
    function(x, y, z, offset) {
        if (x === y || x === -y) {
            return colors.PURPLE;
        } else if (z === offset || z === -offset) {
            return colors.CYAN;
        } else {
            return colors.WHITE;
        }
    },
    
    // Cấp độ 6 - Mẫu cầu vồng
    function(x, y, z, offset) {
        if (z === offset) {
            if (y === 2) return colors.RED;
            if (y === 1) return colors.ORANGE;
            if (y === 0) return colors.YELLOW;
            if (y === -1) return colors.GREEN;
            if (y === -2) return colors.BLUE;
        }
        return colors.WHITE;
    },
    
    // Cấp độ 7 - Mẫu kim tự tháp màu sắc
    function(x, y, z, offset) {
        // Tạo mẫu kim tự tháp với các lớp màu sắc khác nhau
        // Các góc khối lập phương
        if (Math.abs(x) === 2 && Math.abs(y) === 2 && Math.abs(z) === 2) {
            return colors.RED;
        }
        
        // Tạo hiệu ứng kim tự tháp với các lớp màu
        const sum = Math.abs(x) + Math.abs(y) + Math.abs(z);
        
        // Mặt trên - kim tự tháp
        if (z === 2) {
            if (sum <= 4) return colors.YELLOW;
            return colors.ORANGE;
        }
        
        // Mặt dưới - kim tự tháp ngược
        if (z === -2) {
            if (sum <= 4) return colors.CYAN;
            return colors.BLUE;
        }
        
        // Mặt trước và sau - mẫu xoáy
        if (y === 2 || y === -2) {
            if ((x + z) % 2 === 0) return colors.GREEN;
            return colors.PURPLE;
        }
        
        // Mặt trái và phải - mẫu đối xứng
        if (x === 2 || x === -2) {
            if ((y * z) > 0) return colors.PINK;
            return colors.BLACK;
        }
        
        return colors.WHITE;
    },
    
    // Cấp độ 8 - Mẫu mặt cười
    function(x, y, z, offset) {
        if (z === offset) {
            // Mắt
            if ((x === -1 && y === 1) || (x === 1 && y === 1)) {
                return colors.BLACK;
            }
            // Miệng cười
            if (y === -1 && Math.abs(x) <= 1) {
                return colors.BLACK;
            }
            if (x === -1 && y === -2 || x === 1 && y === -2) {
                return colors.BLACK;
            }
        }
        return colors.YELLOW;
    },
    
    // Cấp độ 9 - Mẫu hình học phức tạp
    function(x, y, z, offset) {
        if ((Math.abs(x) + Math.abs(y) + Math.abs(z)) % 3 === 0) {
            return colors.RED;
        } else if ((Math.abs(x) + Math.abs(y) + Math.abs(z)) % 3 === 1) {
            return colors.GREEN;
        } else {
            return colors.BLUE;
        }
    },
    
    // Cấp độ 10 - Mẫu xoay chiều
    function(x, y, z, offset) {
        if (x * y * z > 0) {
            return colors.PURPLE;
        } else if (x * y * z < 0) {
            return colors.ORANGE;
        } else {
            return colors.CYAN;
        }
    },
    
    // Cấp độ 11 - Mẫu phức tạp nhất
    function(x, y, z, offset) {
        const sum = Math.abs(x) + Math.abs(y) + Math.abs(z);
        if (sum === 6) return colors.RED;
        if (sum === 5) return colors.ORANGE;
        if (sum === 4) return colors.YELLOW;
        if (sum === 3) return colors.GREEN;
        if (sum === 2) return colors.BLUE;
        if (sum === 1) return colors.PURPLE;
        return colors.WHITE;
    }
];

// Tạo mẫu mục tiêu dựa trên cấp độ hiện tại
function taoMauMucTieu() {
    // Xóa các khối hiện có
    targetCubes.forEach(cube => targetScene.remove(cube));
    targetCubes = [];
    
    // Tạo mẫu mục tiêu với bo tròn các cạnh
    const geometry = new THREE.BoxGeometry(cubeSize * 0.9, cubeSize * 0.9, cubeSize * 0.9, 1, 1, 1, 0.1);
    
    const offset = Math.floor(gridSize / 2);
    
    // Lấy hàm tạo mẫu cho cấp độ hiện tại (trừ 1 vì mảng bắt đầu từ 0)
    const patternFunction = targetPatterns[currentLevel - 1];
    
    for (let x = -offset; x <= offset; x++) {
        for (let y = -offset; y <= offset; y++) {
            for (let z = -offset; z <= offset; z++) {
                // Bỏ qua các khối bên trong (chỉ tạo vỏ ngoài)
                if (Math.abs(x) < offset && Math.abs(y) < offset && Math.abs(z) < offset) {
                    continue;
                }
                
                // Lấy màu từ hàm mẫu
                const color = patternFunction(x, y, z, offset);
                
                // Sử dụng MeshPhongMaterial để có hiệu ứng ánh sáng tốt hơn
                const material = new THREE.MeshPhongMaterial({ 
                    color, 
                    shininess: 60,
                    specular: 0x111111
                });
                const cube = new THREE.Mesh(geometry, material);
                
                cube.position.set(x, y, z);
                targetScene.add(cube);
                targetCubes.push(cube);
                
                // Store the color for comparison
                cube.userData = { color: color };
            }
        }
    }
    
    // Cập nhật hiển thị cấp độ
    updateLevelDisplay();
}

// Chạy mã Python của người dùng
async function chayMa() {
    try {
        const code = codeEditor.getValue();
        
        // Xóa thông báo lỗi
        document.getElementById('errorOutput').textContent = '';
        
        // Chạy mã của người dùng
        pyodide.runPython(code);
        
        // Xóa các khối hiện có
        mainCubes.forEach(cube => mainScene.remove(cube));
        mainCubes = [];
        
        // Tạo khối mới dựa trên hàm màu của người dùng với bo tròn các cạnh
        const geometry = new THREE.BoxGeometry(cubeSize * 0.9, cubeSize * 0.9, cubeSize * 0.9, 1, 1, 1, 0.1);
        const offset = Math.floor(gridSize / 2);
        
        for (let x = -offset; x <= offset; x++) {
            for (let y = -offset; y <= offset; y++) {
                for (let z = -offset; z <= offset; z++) {
                    // Bỏ qua các khối bên trong (chỉ tạo vỏ ngoài)
                    if (Math.abs(x) < offset && Math.abs(y) < offset && Math.abs(z) < offset) {
                        continue;
                    }
                    
                    // Gọi hàm màu của người dùng
                    const colorName = pyodide.runPython(`color(${x}, ${y}, ${z})`);
                    // Đảm bảo colorName được xử lý đúng, loại bỏ khoảng trắng và chuyển về chữ hoa
                    const processedColorName = colorName.toString().trim().toUpperCase();
                    // Kiểm tra nếu là BLACK (vì 0 là falsy value trong JavaScript)
                    const colorValue = processedColorName === 'BLACK' ? colors.BLACK : (colors[processedColorName] || 0x888888);
                    
                    // Chuyển đổi màu từ Python sang Three.js
                    function chuyenDoiMau(colorName) {
                        if (!colorName) return 0x888888; // Màu xám mặc định nếu không có màu
                        
                        // Xử lý trường hợp colorName là một đối tượng Python
                        let processedColorName = colorName.toString ? colorName.toString() : colorName;
                        
                        // Chuyển đổi tên màu thành chữ hoa để hỗ trợ cả chữ hoa và chữ thường
                        processedColorName = processedColorName.toUpperCase();
                        
                        // Kiểm tra nếu là BLACK (vì 0 là falsy value trong JavaScript)
                        const colorValue = processedColorName === 'BLACK' ? colors.BLACK : (colors[processedColorName] || 0x888888);
                        return colorValue;
                    }
                    
                    // Sử dụng MeshPhongMaterial thay vì MeshLambertMaterial để có hiệu ứng ánh sáng tốt hơn
                    const material = new THREE.MeshPhongMaterial({ 
                        color: colorValue, 
                        shininess: 60,
                        specular: 0x111111
                    });
                    const cube = new THREE.Mesh(geometry, material);
                    
                    cube.position.set(x, y, z);
                    mainScene.add(cube);
                    mainCubes.push(cube);
                    
                    // Store the color for comparison
                    cube.userData = { color: colorValue };
                }
            }
        }
        
        // Kiểm tra xem mẫu có khớp không
        kiemTraKhop();
        
    } catch (error) {
        document.getElementById('errorOutput').textContent = error.toString();
    }
}

// Kiểm tra xem mẫu của người dùng có khớp với mục tiêu không
function kiemTraKhop() {
    if (mainCubes.length !== targetCubes.length) {
        hienThiKetQua(false, "Số lượng khối không khớp!");
        return;
    }
    
    // Sắp xếp các khối theo vị trí để so sánh
    const sapXepTheoViTri = (a, b) => {
        if (a.position.x !== b.position.x) return a.position.x - b.position.x;
        if (a.position.y !== b.position.y) return a.position.y - b.position.y;
        return a.position.z - b.position.z;
    };
    
    const sortedMainCubes = [...mainCubes].sort(sapXepTheoViTri);
    const sortedTargetCubes = [...targetCubes].sort(sapXepTheoViTri);
    
    for (let i = 0; i < sortedMainCubes.length; i++) {
        const mainCube = sortedMainCubes[i];
        const targetCube = sortedTargetCubes[i];
        
        // Kiểm tra xem vị trí có khớp không
        if (!viTriBangNhau(mainCube.position, targetCube.position)) {
            hienThiKetQua(false, "Vị trí khối không khớp!");
            return;
        }
        
        // Kiểm tra xem màu sắc có khớp không
        if (mainCube.userData.color !== targetCube.userData.color) {
            hienThiKetQua(false, "Màu sắc không khớp! Hãy thử lại.");
            return;
        }
    }
    
    // Nếu đây là cấp độ cuối cùng, hiển thị thông báo hoàn thành game
    if (currentLevel === totalLevels) {
        hienThiKetQua(true, "Chúc mừng! Bạn đã hoàn thành tất cả các cấp độ!");
    } else {
        // Nếu không phải cấp độ cuối, hiển thị thông báo và chuyển sang cấp độ tiếp theo sau 2 giây
        hienThiKetQua(true, `Chúc mừng! Bạn đã hoàn thành cấp độ ${currentLevel}!`);
        setTimeout(() => {
            nextLevel();
        }, 2000);
    }
}

// Hàm trợ giúp để kiểm tra xem vị trí có bằng nhau không
function viTriBangNhau(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y && pos1.z === pos2.z;
}

// Hiển thị thông báo kết quả
function hienThiKetQua(success, message) {
    const resultElement = document.getElementById('resultMessage');
    resultElement.textContent = message;
    resultElement.className = 'result-message ' + (success ? 'success' : 'failure');
    resultElement.style.display = 'block';
    
    // Ẩn sau 5 giây
    setTimeout(() => {
        resultElement.style.display = 'none';
    }, 5000);
}

// Chuyển đến cấp độ tiếp theo
function nextLevel() {
    if (currentLevel < totalLevels) {
        currentLevel++;
        taoMauMucTieu();
        updateLevelDisplay();
        // Không tự động cập nhật mã Python mẫu nữa
        // Người dùng sẽ sử dụng nút gợi ý để xem mã mẫu
        // codeEditor.setValue(sampleCodes[currentLevel - 1]);
        
        // Ẩn phần gợi ý khi chuyển cấp độ
        document.getElementById('hintOutput').style.display = 'none';
    }
}

// Chuyển đến cấp độ trước đó
function prevLevel() {
    if (currentLevel > 1) {
        currentLevel--;
        taoMauMucTieu();
        updateLevelDisplay();
        // Không tự động cập nhật mã Python mẫu nữa
        // Người dùng sẽ sử dụng nút gợi ý để xem mã mẫu
        // codeEditor.setValue(sampleCodes[currentLevel - 1]);
        
        // Ẩn phần gợi ý khi chuyển cấp độ
        document.getElementById('hintOutput').style.display = 'none';
    }
}

// Cập nhật hiển thị cấp độ
function updateLevelDisplay() {
    const levelDisplay = document.getElementById('levelDisplay');
    if (levelDisplay) {
        levelDisplay.textContent = `Cấp độ: ${currentLevel}/${totalLevels}`;
    }
}

// Hàm tạo nhãn văn bản
function createTextLabel(text, position, color = 0xffffff) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 64;
    
    context.fillStyle = '#ffffff';
    context.font = 'bold 56px Arial'; // Tăng kích thước font và làm đậm
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        color: color
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.position.set(position.x, position.y, position.z);
    sprite.scale.set(0.7, 0.35, 1); // Tăng kích thước sprite
    
    return sprite;
}

// Vòng lặp hoạt ảnh
function hienThi() {
    requestAnimationFrame(hienThi);
    
    mainControls.update();
    targetControls.update();
    
    mainRenderer.render(mainScene, mainCamera);
    targetRenderer.render(targetScene, targetCamera);
}

// Xử lý khi thay đổi kích thước cửa sổ
function kichThuocCuaSoThayDoi() {
    // Cập nhật góc nhìn chính
    mainCamera.aspect = document.getElementById('cubeContainer').clientWidth / document.getElementById('cubeContainer').clientHeight;
    mainCamera.updateProjectionMatrix();
    mainRenderer.setSize(document.getElementById('cubeContainer').clientWidth, document.getElementById('cubeContainer').clientHeight);
    
    // Cập nhật góc nhìn mục tiêu
    targetCamera.aspect = document.getElementById('targetCubeContainer').clientWidth / document.getElementById('targetCubeContainer').clientHeight;
    targetCamera.updateProjectionMatrix();
    targetRenderer.setSize(document.getElementById('targetCubeContainer').clientWidth, document.getElementById('targetCubeContainer').clientHeight);
}

// Lắng nghe sự kiện
window.addEventListener('resize', kichThuocCuaSoThayDoi);
document.getElementById('runButton').addEventListener('click', chayMa);
document.getElementById('runButton').disabled = true; // Vô hiệu hóa cho đến khi Pyodide được tải

// Lắng nghe sự kiện cho nút gợi ý
document.getElementById('hintButton').addEventListener('click', hienThiGoiY);

// Hàm sao chép toàn bộ code gợi ý
function saoChepCode() {
    const codeText = sampleCodes[currentLevel - 1];
    
    // Sử dụng Clipboard API để sao chép code
    navigator.clipboard.writeText(codeText).then(() => {
        // Hiển thị thông báo thành công
        hienThiKetQua(true, "Đã sao chép code vào clipboard!");
        
        // Hiển thị gợi ý nếu chưa hiển thị
        const hintOutput = document.getElementById('hintOutput');
        if (hintOutput.style.display !== 'block') {
            hienThiGoiY();
        }
    }).catch(err => {
        // Hiển thị thông báo lỗi nếu có
        hienThiKetQua(false, "Không thể sao chép: " + err);
    });
}

// Nút sao chép code giờ được tạo động trong hàm hienThiGoiY()

// Lắng nghe sự kiện cho các nút điều hướng cấp độ
document.getElementById('prevLevelBtn').addEventListener('click', prevLevel);
document.getElementById('nextLevelBtn').addEventListener('click', nextLevel);

// Khởi tạo
window.onload = async function() {
    khoiTaoCanhBa();
    await khoiTaoPyodide();
};