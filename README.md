 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
new file mode 100644
index 0000000000000000000000000000000000000000..3e0537b5fe77c1d1bc7bc35a697338a546dcd9a7
--- /dev/null
+++ b/README.md
@@ -0,0 +1,13 @@
+# 러너의 하루 미니 게임
+
+이 저장소는 키보드로 움직이는 간단한 러너 게임 데모입니다.
+
+## 실행 방법
+
+다음 명령으로 저장소 루트에서 로컬 서버를 실행한 뒤 브라우저로 접속하세요.
+
+```bash
+python -m http.server 8000
+```
+
+브라우저에서 `http://127.0.0.1:8000/index.html`에 접속하면 게임을 볼 수 있습니다.
 
EOF
)
