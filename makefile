frontend:
	cd ./frontend && npm run dev

backend:
	cd ./backend && cargo run

dev:
	make -j 2 frontend backend

.PHONY: frontend backend dev
