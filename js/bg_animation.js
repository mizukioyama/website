    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var spheres = [];
    var sphereSettings = [
      { x: 0, y: 0, z: 0, size: 2, rotationSpeed: 0.01 },
    ];

    // 球体の中心に配置される光源
    var light = new THREE.PointLight(0xffffff, 5, 100);
    scene.add(light);

    // 球体を生成
    createNoisySphere(sphereSettings[0]);

    // 小さい球体を生成
    for (var i = 0; i < 5; i++) {
      createRandomSphere(i);
    }

    function createNoisySphere(setting) {
      var geometry = new THREE.SphereGeometry(setting.size, 32, 32);
      // MeshPhysicalMaterial を使用してテクスチャを適用
      var material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.5,
        map: generateNoisyTexture(),
      });
      var sphere = new THREE.Mesh(geometry, material);

      sphere.position.x = setting.x;
      sphere.position.y = setting.y;
      sphere.position.z = setting.z;

      spheres.push({ mesh: sphere, settings: setting });
      scene.add(sphere);
    }

    function generateNoisyTexture() {
      var canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      var context = canvas.getContext('2d');
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;

      for (var i = 0; i < data.length; i += 4) {
        var value = Math.floor(Math.random() * 255);
        data[i] = value;     // Red
        data[i + 1] = value; // Green
        data[i + 2] = value; // Blue
        data[i + 3] = 255;   // Alpha
      }

      context.putImageData(imageData, 1, 0);
      var texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    function createRandomSphere(index) {
      var size = Math.random() * .8 + 0.5; // ランダムなサイズ（0.5から1.5の範囲）
      var x = (Math.random() - 0.5) * 12;
      var y = (Math.random() - 0.5) * 15;
      var z = Math.random() * 7; // 手前に配置するために z を正の値にする

      createNoisySphere({ x: x, y: y, z: z, size: size, rotationSpeed: 0.02 }, index);
    }

    // マウスの移動イベント
    window.addEventListener('mousemove', function (event) {
      moveSpheres(event.clientX, event.clientY);
    });

    // スクロールイベント
    window.addEventListener('wheel', function (event) {
      var deltaY = event.deltaY;
      animateScroll(deltaY);
    });

    function moveSpheres(mouseX, mouseY) {
      var normalizedX = (mouseX / window.innerWidth) * 2 - 1;
      var normalizedY = - (mouseY / window.innerHeight) * 2 + 1;

      // 中央の球体を軸にして水平と垂直に移動させる
      spheres[0].settings.x = normalizedX * 7;
      spheres[0].settings.y = normalizedY * 7;

      // 光源の位置を球体の中心に連動
      light.position.x = spheres[0].settings.x;
      light.position.y = spheres[0].settings.y;
      light.position.z = spheres[0].settings.z + 10; // 適宜調整

      // 各小さい球体の位置を更新
      for (var i = 1; i < spheres.length; i++) {
        spheres[i].settings.rotationSpeed += 0.02; // 小さい球体は回転させる

        // 球体のインデックスが奇数なら左回転、偶数なら右回転
        var rotationDirection = (i % 2 === 0) ? 1 : -1;

        spheres[i].mesh.position.x += Math.sin(spheres[i].settings.rotationSpeed) * 0.1 * rotationDirection;
        spheres[i].mesh.position.y += Math.cos(spheres[i].settings.rotationSpeed) * 0.1 * rotationDirection;
      }
    }

    function animateScroll(deltaY) {
      var centerY = spheres[0].settings.y;

      // 中央の球体を基準に縦に並べる
      spheres.forEach(function (sphere, index) {
        if (index === 0) {
          return; // 中央の球体はサイズ変更しない
        }

        var targetY = centerY + index * 3; // 2は各球体の間隔
        sphere.settings.y += (targetY - sphere.settings.y) * 0.1;

        // 最小サイズを1に制限
        if (sphere.settings.size > 1) {
          sphere.settings.size *= 0.95; // サイズを小さくする
          sphere.settings.size = Math.max(1, sphere.settings.size); // サイズが1未満にならないようにする
        }

        // スクロール方向と逆方向に3D移動
        sphere.settings.z -= deltaY * 0.01;

        sphere.mesh.position.y = sphere.settings.y;
        sphere.mesh.position.z = sphere.settings.z;
        sphere.mesh.scale.set(sphere.settings.size, sphere.settings.size, sphere.settings.size);
      });

      // 光の強さを調整
      light.intensity += deltaY * 0.01;
      light.intensity = Math.max(0, light.intensity); // 0以下にはならないようにする

      // 光源の位置を球体の中心に連動
      light.position.x = spheres[0].settings.x;
      light.position.y = spheres[0].settings.y;
      light.position.z = spheres[0].settings.z + 10; // 適宜調整
    }

    var animate = function () {
      requestAnimationFrame(animate);

      // 球体を回転させる
      spheres.forEach(function (sphere) {
        sphere.mesh.rotation.x += sphere.settings.rotationSpeed;
        sphere.mesh.rotation.y += sphere.settings.rotationSpeed;
      });

      renderer.render(scene, camera);
    };

    window.addEventListener('resize', function () {
      var newWidth = window.innerWidth;
      var newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    });

    animate();