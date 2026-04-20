export default function PostContent({ content }) {
  return (
    <div className="post-content">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
