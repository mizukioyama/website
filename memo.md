m.oyama
https://github.com/mizukioyama

# ① 初回だけ

git config --global user.name "m.oyama"
git config --global user.email "oyamawprks24@gmail.com"

# ② クローン

git clone https://github.com/mizukioyama/website.git

# ③ 移動

cd website

# ④ 依存

npm install

# ⑤ ビルド

npm run build

# ⑥ 反映

git add .
git commit -m "memo up date"
git push origin main

git status

ls -a

cd ..

git rm --cached website

rmdir /s /q website\.git

↓調べる
$ rmdir /s /q website\.git
rmdir: failed to remove '/s': No such file or directory
rmdir: failed to remove '/q': No such file or directory
rmdir: failed to remove 'website.git': No such file or directory
