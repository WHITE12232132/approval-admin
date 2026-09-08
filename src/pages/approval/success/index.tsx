import { useNavigate } from 'react-router-dom'

const ApprovalSuccess = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
      <h2 style={{ marginBottom: '10px' }}>提交成功</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        您的申请已提交，请等待审批
      </p>
      <button
        onClick={() => navigate('/approval')}
        style={{
          padding: '10px 30px',
          backgroundColor: '#1890ff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        返回列表
      </button>
    </div>
  )
}

export default ApprovalSuccess