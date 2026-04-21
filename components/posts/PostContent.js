export default function PostContent({ content }) {
  return (
    <div 
      className="post-content" 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}