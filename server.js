/* styles.css */
body { margin: 0; }
header { padding: 1rem; }
section { padding: 1rem; }
#bioForm { gap: 0.5rem; }
#bioForm select, #bioForm input, #bioForm button { width: 100%; }
#bioOutput div { min-height: 100px; }
@media (max-width: 640px) {
  #bioForm { grid-template-columns: 1fr; }
  #bioOutput { grid-template-columns: 1fr; }
}
@media (min-width: 641px) {
  #bioForm { grid-template-columns: 1fr 1fr; }
  #bioOutput { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  #bioOutput { grid-template-columns: 1fr 1fr 1fr; }
}
